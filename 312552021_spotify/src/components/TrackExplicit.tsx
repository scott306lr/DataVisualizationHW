import React from "react";
import { SpotifyData } from "../utils/dataHandler";
import { dataUniqueKeyValueCount } from "../utils/utils";
import MyPieChart from "./MyPieChart";

interface IProps {
  data: SpotifyData[];
}

const TrackExplicit: React.FC<IProps> = ({ data }) => {
  const explicit_cnt = dataUniqueKeyValueCount(data, "explicit");
  const pieData = explicit_cnt
    .map((mode) => {
      return {
        id: mode.key,
        label: mode.key,
        value: mode.value,
      };
    })
    .sort((a) => {
      return a.id === "True" ? 1 : -1;
    });

  return (
    <div className="flex h-min w-min flex-col items-center justify-center py-4">
      <h1 className="text-2xl font-bold text-[#274c77]">Explicit Tracks</h1>
      <div className="flex h-[12rem] w-[16rem] items-center justify-center">
        <MyPieChart data={pieData} scheme="paired" />
      </div>
    </div>
  );
};

export default TrackExplicit;
