import { ResponsiveHeatMap } from "@nivo/heatmap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyHeatMap: React.FC<{ data: any; step: number }> = ({ data, step }) => {
  return (
    //center
    <div className="grid h-full w-full place-items-center">
      <ResponsiveHeatMap
        theme={{
          axis: {
            legend: { text: { fontSize: 16 } },
            ticks: { text: { fontSize: 18 } },
          },
          labels: {
            text: { fontSize: 14, fontWeight: "bold" },
          },
          legends: {
            ticks: { text: { fontSize: 12 } },
            title: { text: { fontSize: 16 } },
          },
        }}
        data={data}
        margin={{ top: -220, right: 120, bottom: 10, left: 160 }}
        valueFormat="<-2.3r"
        forceSquare={true}
        axisTop={null}
        axisBottom={{
          // format: (value: number) => <tspan className="w-32">{value}</tspan>,
          tickSize: 8,
          tickPadding: 8,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 8,
          tickPadding: 8,
          tickRotation: 0,
          // legend: "country",
          // legendPosition: "middle",
          // legendOffset: -90,
        }}
        colors={{
          type: "diverging",

          divergeAt: step,
          // type: "quantize",
          // steps: step,
          // scheme: "yellow_orange_red",
          // scheme: "magma",

          colors: ["#000000", "#af0000", "#ffdf00"],
          // colors: ["black", "red", "yellow"],
          minValue: 0,
          maxValue: 1,
        }}
        //gray
        emptyColor="#feeee0"
        inactiveOpacity={0.1}
        borderColor="#f50000"
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        legends={[
          {
            anchor: "right",
            translateX: 60,
            translateY: -30,
            length: 320,
            thickness: 10,
            direction: "column",
            tickPosition: "after",
            tickSize: 8,
            tickSpacing: 5,
            tickOverlap: false,
            tickFormat: "<-3.0r",
            title: "Correlation",
            titleAlign: "start",
            titleOffset: 8,
          },
        ]}
        annotations={[]}
      />
    </div>
  );
};

export default MyHeatMap;
