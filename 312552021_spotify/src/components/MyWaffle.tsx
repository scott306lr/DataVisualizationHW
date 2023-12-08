import React from "react";

import { ResponsiveWaffle } from "@nivo/waffle";
import { ColorSchemeId } from "@nivo/colors";

interface IProps {
  data: {
    id: string;
    label: string;
    value: number;
  }[];
  total: number;
  scheme?: ColorSchemeId;
}

const MyWaffle: React.FC<IProps> = ({ data, total }) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <ResponsiveWaffle
        data={data}
        total={total}
        rows={5}
        columns={5}
        fillDirection="right"
        padding={2}
        // valueFormat=".2f"
        // margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
        colors={["#a6e1fa", "#0e6ba8", "#0a2472", "#001c55", "#00072d"]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        motionStagger={2}
        legends={[]}
      />
    </div>
  );
};

export default MyWaffle;
