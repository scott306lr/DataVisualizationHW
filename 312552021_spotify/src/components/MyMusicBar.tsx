import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface IProps {
  data: {
    id: string;
    major: number;
    minor: number;
  }[];
}

const MyMusicBar: React.FC<IProps> = ({ data }) => {
  // const key_mode_cnt = dataUniqueKeyValueCount(data, "key_mode");

  const key_order = [
    "C",
    "C♯/D♭",
    "D",
    "D♯/E♭",
    "E",
    "F",
    "F♯/G♭",
    "G",
    "G♯/A♭",
    "A",
    "A♯/B♭",
    "B",
  ];

  const colors = [
    "#E52452",
    "#F47125",
    "#F9A71D",
    "#FFD339",
    "#FFF430",
    "#C4DD69",
    "#6DC351",
    "#02A69F",
    "#047CC3",
    "#6A5AA9",
    "#9866B0",
    "#D447A0",
  ];

  const maxValue = Math.max(...data.map((d) => Math.max(d.major, -d.minor)));

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <ResponsiveBar
        data={data}
        maxValue={maxValue}
        minValue={-maxValue}
        margin={{ top: 20, right: 50, bottom: 20, left: 25 }}
        enableLabel={false}
        keys={["major", "minor"]}
        colors={({ data }) => {
          //key order is the same as the colors array
          // console.log(id, data, key_order.indexOf(`${data.id}`));
          return colors[key_order.indexOf(`${data.id}`)];
        }}
        //abs(value)
        valueFormat={(value) => `${Math.abs(value)}`}
        markers={[
          {
            axis: "y",
            value: 0,
            lineStyle: {
              stroke: "#b0413e",
              strokeWidth: 2,
            },
          },
        ]}
        axisTop={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10000,
          legend: "Key count",
          legendPosition: "middle",
          legendOffset: -15,
        }}
        axisRight={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: 4,
          format: (value) => `${Math.abs(value)}`,
        }}
        tooltipLabel={(d) => `${d.indexValue} - ${d.id}`}
        theme={{ axis: { legend: { text: { fontSize: 20 } } } }}
      />
    </div>
  );
};

export default MyMusicBar;
