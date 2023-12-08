import { Slider } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { SpotifyData } from "../utils/dataHandler";
import PopularBoxPlot from "./boxplots/PopularBoxPlot";
import { TbFilterStar } from "react-icons/tb";

const TrackFilter: React.FC<{
  data: SpotifyData[];
  filteredData: SpotifyData[];
  setFilteredData: Dispatch<SetStateAction<SpotifyData[]>>;
}> = ({ data, filteredData, setFilteredData }) => {
  const [popRange, setPopRange] = useState<number[]>([0, 100]);
  const popData = filteredData.map((track) => ({
    group: "popularity",
    value: track.popularity,
  }));

  const popMinMax = useMemo(() => {
    const min = Math.floor(Math.min(...data.map((d) => d.popularity)));
    const max = Math.ceil(Math.max(...data.map((d) => d.popularity)));
    return [min, max];
  }, [data]);

  useEffect(() => {
    setFilteredData(data);
  }, [data, setFilteredData]);

  useEffect(() => {
    setPopRange([popMinMax[0], popMinMax[1]]);
  }, [popMinMax]);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (track) =>
          track.popularity >= popRange[0] && track.popularity <= popRange[1],
      ),
    );
  }, [data, popRange, setFilteredData]);

  const marks = [
    {
      value: popMinMax[0],
      label: popMinMax[0],
    },
    {
      value: popMinMax[1],
      label: popMinMax[1],
    },
  ];

  return (
    <div className="flex h-min w-full flex-col items-center justify-center rounded-xl border-2 border-gray-100 bg-[#f9f7f3] p-4 shadow-md shadow-gray-700">
      <div className="flex h-min w-full flex-col justify-center gap-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-[#274c77]">
          <TbFilterStar className="h-8 w-8" />
          Popularity Range Filter
          <span className="ml-auto block text-xl font-bold">
            (Total Tracks: {filteredData.length} / {data.length})
          </span>
        </h1>
      </div>
      <div className="flex h-min w-full flex-col justify-center gap-4 p-4">
        <div className="flex h-[8rem] w-full items-center justify-center">
          <PopularBoxPlot
            data={popData}
            min={popMinMax[0]}
            max={popMinMax[1]}
            colors={["#e76f51"]}
          />
        </div>
        {/* <Typography id="range-slider">Popularity Range</Typography> */}
        <div className="flex h-min w-full flex-col items-center justify-center px-4">
          <Slider
            value={popRange}
            min={popMinMax[0]}
            max={popMinMax[1]}
            onChange={(e, newValue) => {
              const [l, r] = newValue as number[];
              setPopRange([l, r]);
            }}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            marks={marks}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackFilter;
