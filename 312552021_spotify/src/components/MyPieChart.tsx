import React from "react";

import { ResponsivePie } from "@nivo/pie";
import { ColorSchemeId } from "@nivo/colors";

interface IProps {
  data: {
    id: string;
    value: number;
  }[];
  scheme?: ColorSchemeId;
}

const MyPieChart: React.FC<IProps> = ({ data, scheme }) => {
  return (
    <div className="flex h-full w-full flex-col justify-center">
      <ResponsivePie
        data={data}
        margin={{ top: 15, bottom: 15 }}
        valueFormat=" >-"
        activeOuterRadiusOffset={3}
        borderWidth={1}
        colors={{ scheme: scheme ?? "nivo" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsDiagonalLength={10}
        arcLinkLabelsStraightLength={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        isInteractive={true}
      />
    </div>
  );
};

export default MyPieChart;
