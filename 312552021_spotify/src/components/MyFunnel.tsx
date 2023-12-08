import React from "react";
import { ResponsiveFunnel } from "@nivo/funnel";

interface IProps {
  data: {
    id: string;
    value: number;
  }[];
}

const MyFunnel: React.FC<IProps> = ({ data }) => {
  // const key_mode_cnt = dataUniqueKeyValueCount(data, "key_mode");

  // const key_order = [
  //   "C",
  //   "C♯/D♭",
  //   "D",
  //   "D♯/E♭",
  //   "E",
  //   "F",
  //   "F♯/G♭",
  //   "G",
  //   "G♯/A♭",
  //   "A",
  //   "A♯/B♭",
  //   "B",
  // ];
  // const funnelData = key_mode_cnt.map((key_mode) => {
  //   return {
  //     id: key_mode.key,
  //     value: key_mode.value,
  //     label: key_mode.key,
  //   };
  // });

  // const major_funnelData = funnelData
  //   .filter((key_mode) => key_mode.id.includes("major"))
  //   .sort((a, b) => {
  //     //prune the "major" and "minor" from the id
  //     const a_key = a.id.slice(0, -6);
  //     const b_key = b.id.slice(0, -6);
  //     //find the index of the key in the key_order array
  //     return key_order.indexOf(a_key) - key_order.indexOf(b_key);
  //   });

  // const minor_funnelData = funnelData.filter((key_mode) =>
  //   key_mode.id.includes("minor"),
  // );

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <ResponsiveFunnel
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        valueFormat=">-.4s"
        direction={"horizontal"}
        colors={[
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
        ]}
        borderWidth={10}
        // labelColor={{
        //   from: "color",
        //   modifiers: [["darker", 3]],
        // }}
        enableLabel={false}
        // enableBeforeSeparators={false}

        enableAfterSeparators={false}
        currentPartSizeExtension={10}
        // currentBorderWidth={40}
        motionConfig="wobbly"
      />
    </div>
  );
};

export default MyFunnel;
