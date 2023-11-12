import * as d3 from "d3";

export class SankeyChart {
  // let data;
  // let id;
  // let width = 954;
  // let height = 600;
  // let format;
  // let color;
  // let edgeColor;
  // let showTotal;

  constructor() {
    this.data = null;
    this.id = null;
    this.width = 954;
    this.height = 600;
    this.format = null;
    this.color = null;
    this.edgeColor = null;
    this.showTotal = null;
  }

  format = () => {
    const format = d3.format(",.0f");
    return this.data.units ? d => `${format(d)} ${this.data.units}` : format;
  }

  color = () => {
    // https://observablehq.com/@d3/d3-scaleordinal
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    return d => color(d.category === undefined ? d.name : d.category);
  }

  setSelector = (s) => {
    this.id = s;
  };

  setDataSet = (d) => {
    this.data = d;
  };

  setWidth = (w) => {
    this.width = w;
  };

  setHeight = (h) => {
    this.height = h;
  };

  draw = () => {
    const svg = d3.select(this.id).create("svg").attr("viewBox", [0, 0, this.width, this.height]);
  // Defining 'sankey' here because update will be used in dragMove: https://github.com/d3/d3-sankey#sankey_update
    const sankey = d3
      .sankey()
      .nodeId((d) => d.name)
      // .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [1, 5],
        [this.width - 1, this.height - 5]
      ]);

    //This logic makes a copy of data.nodes and data.links, which will be extended with drag logic

    let dataNodes = this.data.nodes.map((d) => Object.assign({}, d));
    let dataLinks = this.data.links.map((d) => Object.assign({}, d));

    let group = sankey({ nodes: dataNodes, links: dataLinks });

    // Prepend a 'Total' Node to chart.  To do so, extract total values from group sankey structure for top nodes.
    // An alternative pattern to determine the 'Total' node's properties form the original 'data' is shown below
    // at the end of this cell.
    // if (this.showTotal) {
    //   const totalLinks = group.nodes
    //     .filter(({ targetLinks }) => targetLinks.length == 0)
    //     .map(({ name, value }) => ({ source: "Total", target: name, value }));

    //   dataNodes = [{ name: "Total", category: "Total" }].concat(dataNodes);

    //   dataLinks = totalLinks.concat(dataLinks);

    //   group = sankey({ nodes: dataNodes, links: dataLinks });
    // } // if

    const nodes = group.nodes;
    const links = group.links;

    const nodeWidth = nodes[0].x1 - nodes[0].x0;

    // Container for draggable nodes
    const node = svg
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

    // Relative to container
    node
      .append("rect")
      .attr("height", (d) => d.y1 - d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("fill", this.color)
      .attr("stroke", "#000")
      .append("title")
      .text((d) => `${d.name}\n${this.format(d.value)}`);

    // Relative to container/ node rect
    node
      .append("text")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("x", (d) => (d.x0 < this.width / 2 ? 6 + (d.x1 - d.x0) : -6)) // +/- 6 pixels relative to container
      .attr("y", (d) => (d.y1 - d.y0) / 2) // middle of node
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => (d.x0 < this.width / 2 ? "start" : "end"))
      .text((d) => d.name);

    // d3V6 events: https://observablehq.com/@d3/d3v6-migration-guide#events
    node
      .attr("cursor", "move")
      .call(d3.drag().on("start", dragStart).on("drag", dragMove));

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.5)
      .selectAll("g")
      .data(links)
      .join("g")
      .style("mix-blend-mode", "multiply");

    if (this.edgeColor === "path") {
      const gradient = link
        .append("linearGradient")
        .attr("id", (d) => (d.uid = document.uid("link")).id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", (d) => d.source.x1)
        .attr("x2", (d) => d.target.x0);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", (d) => this.color(d.source));

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", (d) => this.color(d.target));
    } //if

    link
      .append("path")
      .attr("class", "link")
      .attr("d", d3.sankeyLinkHorizontal())
      .attr("stroke", (d) =>
      this.edgeColor === "none"
          ? "#aaa"
          : this.edgeColor === "path"
          ? d.uid
          : this.edgeColor === "input"
          ? this.color(d.source)
          : this.color(d.target)
      )
      .attr("stroke-width", (d) => Math.max(1, d.width));

    link
      .append("title")
      .text((d) => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`);

    function dragStart(event, d) {
      d.__x = event.x;
      d.__y = event.y;
      d.__x0 = d.x0;
      d.__y0 = d.y0;
      d.__x1 = d.x1;
      d.__y1 = d.y1;
    } //dragStart

    function dragMove(event, d) {
      d3.select(this).attr("transform", function (d) {
        const dx = event.x - d.__x;
        const dy = event.y - d.__y;
        d.x0 = d.__x0 + dx;
        d.x1 = d.__x1 + dx;
        d.y0 = d.__y0 + dy;
        d.y1 = d.__y1 + dy;

        if (d.x0 < 0) {
          d.x0 = 0;
          d.x1 = nodeWidth;
        } // if

        if (d.x1 > this.width) {
          d.x0 = this.width - nodeWidth;
          d.x1 = this.width;
        } // if

        if (d.y0 < 0) {
          d.y0 = 0;
          d.y1 = d.__y1 - d.__y0;
        } // if

        if (d.y1 > this.height) {
          d.y0 = this.height - (d.__y1 - d.__y0);
          d.y1 = this.height;
        } // if

        return `translate(${d.x0}, ${d.y0})`;
      }); //.attr('transform', function (d) {

      // https://github.com/d3/d3-sankey#sankey_update
      sankey.update({ nodes, links });
      link.selectAll(".link").attr("d", d3.sankeyLinkHorizontal());
    } //dragMove

    return svg.node();
  }
}