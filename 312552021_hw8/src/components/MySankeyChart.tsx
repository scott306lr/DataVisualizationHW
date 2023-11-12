import { Sankey } from "@ant-design/plots";
import { CarEvalaluationData } from "../utils/dataHandler";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MySankeyChart: React.FC<{
  data: CarEvalaluationData[];
  keyOrder: string[];
}> = ({ data, keyOrder }) => {
  interface Count {
    [key: string]: number;
  }

  const count: Count = {};
  data.forEach((d) => {
    keyOrder.reduce((a, b) => {
      const key = `${d[a]}-${d[b]}`;
      if (key in count) {
        count[key] += 1;
      } else {
        count[key] = 1;
      }
      return b;
    });
  });

  interface keyUniqueValueDict {
    [key: string]: string[];
  }
  const keyUniqueValueDict: keyUniqueValueDict = {
    buying: ["buying-vhigh", "buying-high", "buying-med", "buying-low"],
    maint: ["maint-vhigh", "maint-high", "maint-med", "maint-low"],
    doors: ["doors-5more", "doors-4", "doors-3", "doors-2"],
    persons: ["persons-more", "persons-4", "persons-2"],
    lug_boot: ["lug_boot-big", "lug_boot-med", "lug_boot-small"],
    safety: ["safety-high", "safety-med", "safety-low"],
  };

  interface SankeyData {
    source: string;
    target: string;
    value: number;
    path: string;
  }

  const sankeyData: SankeyData[] = [];

  keyOrder.reduce((a, b) => {
    const aUVs = keyUniqueValueDict[a];
    const bUVs = keyUniqueValueDict[b];
    aUVs.forEach((aUV) => {
      bUVs.forEach((bUV) => {
        const key = `${aUV}-${bUV}`;
        sankeyData.push({
          source: aUV,
          target: bUV,
          value: key in count ? count[key] : 0,
          path: `${aUV} -> ${bUV}`,
        });
      });
    });
    return b;
  });

  console.log(sankeyData);

  let colors: string[] = [];
  keyOrder.forEach((key) => {
    if (key.includes("buying")) {
      colors = colors.concat(["#D3DCEC", "#A7B8D9", "#6683BC", "#244E9F"]);
    }
    if (key.includes("maint")) {
      colors = colors.concat(["#E4DBEF", "#AE92CF", "#936DBE", "#7849AE"]);
    }
    if (key.includes("doors")) {
      colors = colors.concat(["#F7F0DB", "#E6D192", "#D5B249", "#C49300"]);
    }
    if (key.includes("persons")) {
      colors = colors.concat(["#E8EEDB", "#A2BC6D", "#5C8A00"]);
    }
    if (key.includes("lug_boot")) {
      colors = colors.concat(["#E7C8EA", "#C880CD", "#B049B8"]);
    }
    if (key.includes("safety")) {
      colors = colors.concat(["#ECCAC8", "#D99492", "#BF4D49"]);
    }
  });
  console.log(colors);

  const config = {
    sourceField: "source",
    targetField: "target",
    weightField: "value",
    nodeWidthRatio: 0.015,
    // nodeWidth: 100,
    nodePaddingRatio: 0.08,
    nodeDraggable: true,
    // nodeStyle: {
    //   fillOpacity: 0.85,
    //   stroke: "black",
    // },
    rawFields: ["path"],
    tooltip: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customContent: (_title: string, items: any[]) => {
        return (
          <>
            {/* <h5 style={{ marginTop: 16 }}>{title}</h5> */}
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                const name0 = name.split(" -> ")[0];
                const name1 = name.split(" -> ")[1];
                return (
                  <li
                    key={index}
                    className="g2-tooltip-list-item text-xl"
                    data-index={index}
                    style={{
                      marginBottom: 4,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="g2-tooltip-marker"
                      style={{ backgroundColor: color, marginBottom: -5 }}
                    ></span>
                    <span
                      style={{
                        display: "inline-flex",
                        flex: 1,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {/* From {name0} to {name1} :  Highlight name0, name1, and value */}
                      <span className="underline">{name0}</span>
                      {" -> "}
                      <span className="underline">{name1}</span>
                      {": "}
                      <span className="g2-tooltip-list-item-value font-bold">
                        {value}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
  };

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-xl border-2 border-gray-500 bg-white shadow-md shadow-gray-400">
      <Sankey
        {...config}
        data={sankeyData}
        color={colors}
        edgeStyle={{
          lineWidth: 2,
          opacity: 0.8,
        }}
        nodeStyle={{
          stroke: "black",
          lineWidth: 2,
          opacity: 1,
        }}
      />
      {/* <DnDList items={keyOrder} setItems={setKeyOrder}>
        <Card item={""} />
      </DnDList> */}
    </div>
  );
};

export default MySankeyChart;
