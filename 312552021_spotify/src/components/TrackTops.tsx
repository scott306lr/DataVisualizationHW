import React, { useMemo, useState } from "react";
import { SpotifyData } from "../utils/dataHandler";
import { useVirtualizer } from "@tanstack/react-virtual";
import { capitalize, formatTime } from "../utils/utils";
import MyModal from "./MyModal";
import { Dropdown } from "flowbite-react/lib/esm/components/Dropdown";
import DurationBoxPlot from "./boxplots/DurationBoxPlot";
import PopularBoxPlot from "./boxplots/PopularBoxPlot";
import { Tooltip } from "flowbite-react";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { GrContactInfo } from "react-icons/gr";
import { PiMetronome, PiTimer, PiStar, PiRadio } from "react-icons/pi";

const TrackInfo: React.FC<{
  data: SpotifyData[];
  selectedId: number;
}> = ({ data, selectedId }) => {
  const [increment, setIncrement] = useState<number>(0);
  const new_index = selectedId + increment;

  const track = data[new_index];

  const popData = data.map((track) => ({
    group: "popularity",
    value: track.popularity,
  }));

  const tempoData = data.map((track) => ({
    group: "tempo",
    value: track.tempo,
  }));

  const durData = data.map((track) => ({
    group: "duration",
    value: track.duration_s,
  }));

  return (
    <div className="flex h-[25rem] w-full items-center justify-center gap-6 overflow-hidden px-4">
      <div className="roundex-xl flex h-full w-full flex-col items-center justify-center gap-4">
        <div className="flex h-min w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-gray-400 p-4 shadow-lg">
          <div className="items-between flex h-min w-full items-end justify-between gap-4 px-12">
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200/30 bg-gray-500/10 shadow-md hover:cursor-pointer hover:bg-gray-400/50"
              onClick={() =>
                setIncrement((prev) =>
                  prev === 0 ? data.length - 1 : prev - 1,
                )
              }
            >
              <SlArrowLeft />
            </button>
            <img className="h-[8rem] w-[8rem]" src="CD.jpg" alt="a" />
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200/30 bg-gray-500/10 shadow-md hover:cursor-pointer hover:bg-gray-400/50"
              onClick={() =>
                setIncrement((prev) =>
                  prev === data.length - 1 ? 0 : prev + 1,
                )
              }
            >
              <SlArrowRight />
            </button>
          </div>
          <div className="flex h-min w-[22rem] flex-col items-center justify-center ">
            <h1 className="text-2xl font-bold">{new_index + 1}.</h1>
            <Tooltip content={`Track: ${track.track_name}`}>
              <h1 className="line-clamp-1 text-2xl font-bold">
                {track.track_name}
              </h1>
            </Tooltip>
          </div>
          <div className="flex h-min w-full flex-col items-center justify-center">
            <div className="flex w-[15rem] flex-col items-center justify-center">
              <Tooltip content={`Artists: ${track.artists.join(", ")}`}>
                <span className="line-clamp-1 text-xl font-light">
                  {track.artists.join(", ")}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col justify-center gap-2 px-4">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <GrContactInfo className="h-8 w-8" />
            Track Details
            <Tooltip content={`Genre: ${capitalize(track.track_genre)}`}>
              <span className="line-clamp-1 text-2xl font-light">
                ({capitalize(track.track_genre)})
              </span>
            </Tooltip>
          </h1>
          <div className="text-md items-left grid h-min w-full grid-cols-2 grid-rows-2 justify-center gap-2 px-2">
            <span className="col-span-2 col-start-1 row-start-1 gap-2">
              Key/Mode:{" "}
              <span className="text-lg font-bold">
                {track.key} {capitalize(track.mode)}
              </span>
            </span>
            {/* <span className="col-start-1 row-start-2 gap-2">
              Tempo (BPM):{" "}
              <span className="text-lg font-bold">{track.tempo}</span>
            </span> */}
            <span className="col-start-1 row-start-2 gap-2">
              Time Signature:{" "}
              <span className="text-lg font-bold">
                {track.time_signature}/4
              </span>
            </span>
            <span className="col-start-2 row-start-2">
              Explicit:{" "}
              <span className="text-lg font-bold">{track.explicit}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-center gap-4">
        <div className="flex h-[8rem] w-full flex-col justify-center">
          <h1 className="flex items-center gap-2 text-lg">
            <PiStar className="h-6 w-6" />
            Popularity
          </h1>
          <PopularBoxPlot
            data={popData}
            markerValue={track.popularity}
            margin={{ left: 20, right: 20, bottom: 24, top: 24 }}
            colors={["#e76f51"]}
          />
        </div>
        <div className="flex h-[8rem] w-full flex-col justify-center">
          <h1 className="flex items-center gap-2 text-lg">
            <PiMetronome className="h-6 w-6" />
            Tempo (BPM)
          </h1>
          <PopularBoxPlot
            data={tempoData}
            markerValue={track.tempo}
            margin={{ left: 20, right: 20, bottom: 24, top: 24 }}
            colors={["#2a9d8f"]}
          />
        </div>
        <div className="flex h-[8rem] w-full flex-col justify-center">
          <h1 className="flex items-center gap-2 text-lg">
            <PiTimer className="h-6 w-6" />
            Duration
          </h1>
          <DurationBoxPlot
            data={durData}
            markerValue={track.duration_s}
            margin={{ left: 20, right: 20, bottom: 24, top: 24 }}
            colors={["#e9c46a"]}
          />
        </div>
      </div>
    </div>
  );
};

const RowVirtualizerFixed: React.FC<{
  data: SpotifyData[];
}> = ({ data }) => {
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  const [openInd, setOpenInd] = useState<number | undefined>(undefined);
  const parentRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 16,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-gray-100 bg-white px-4 py-4 shadow-md shadow-gray-400">
      <div ref={parentRef} className="flex h-full w-full overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const vData = data[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                className="flex items-center justify-between gap-2 p-1 text-black"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="flex h-full w-full items-center justify-center rounded-xl border-2 p-2 shadow-md hover:cursor-pointer hover:bg-gray-200 hover:shadow-lg">
                  <div
                    className="line-clamp-1 flex w-[20rem] items-center space-x-3"
                    onClick={() => {
                      setOpenInd(virtualRow.index);
                      setOpenModal("dismissible");
                    }}
                  >
                    <span className="truncate text-xl font-bold">
                      {virtualRow.index + 1}. {vData.track_name}
                    </span>
                  </div>
                  <span className="w-[4rem] px-2 text-right text-base font-light">
                    {formatTime(vData.duration_s)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {openInd != undefined && (
        <MyModal
          title={"Track Info"}
          size={"5xl"}
          openModal={openModal}
          setOpenModal={setOpenModal}
        >
          <TrackInfo data={data} selectedId={openInd} />
        </MyModal>
      )}
    </div>
  );
};

const sortKeys = [
  "name",
  "popularity",
  "tempo",
  "duration",
  "instrumentalness",
  "liveness",
  "speechiness",
  "danceability",
  "energy",
  "valence",
  "acousticness",
  "loudness",
];

const TopTracks: React.FC<{
  data: SpotifyData[];
}> = ({ data }) => {
  const [sortKey, setSortKey] = useState<string>("popularity");
  const sortedData = useMemo(() => {
    switch (sortKey) {
      case "name":
        return [...data].sort((a, b) =>
          a && b ? a.track_name.localeCompare(b.track_name) : 0,
        );
      default:
        return [...data].sort(
          (a, b) => (b[sortKey] as number) - (a[sortKey] as number),
        );
    }
  }, [data, sortKey]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 pb-4 pr-4 pt-10">
      <div className="grid h-min w-full grid-cols-3 gap-4">
        <h1 className="col-span-2 col-start-1 flex items-center gap-2 px-4 text-center text-2xl font-bold">
          <PiRadio className="h-8 w-8" />
          All Tracks
        </h1>
        <div className="z-10 col-start-3 flex h-full w-full items-center justify-center drop-shadow-md">
          <Dropdown label="Sort by" size="sm">
            {sortKeys.map((key) => (
              <Dropdown.Item onClick={() => setSortKey(key)}>
                {capitalize(key)}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>
      <div className="flex h-full w-[24rem] items-center justify-center py-2 pl-2">
        <RowVirtualizerFixed data={sortedData} />
      </div>
    </div>
  );
};

export default TopTracks;
