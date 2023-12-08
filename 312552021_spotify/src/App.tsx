// import { useState } from "react";
import { ReactNode, Suspense, useEffect, useState } from "react";
import "./App.css";
import {
  Collection,
  SpotifyData,
  SpotifyDataFetcher,
} from "./utils/dataHandler";
import useSWR from "swr";

import GroupBuilder from "./components/GroupBuilder";
import TrackKeys from "./components/TrackKeys";
import TrackScores from "./components/TrackScores";
import TrackFilter from "./components/TrackFilter";
import TopTracks from "./components/TrackTops";
import { Tooltip } from "flowbite-react";
import TrackExplicit from "./components/TrackExplicit";
import { PiMetronome, PiTimer, PiTrashFill } from "react-icons/pi";
import PopularBoxPlot from "./components/boxplots/PopularBoxPlot";
import DurationBoxPlot from "./components/boxplots/DurationBoxPlot";

//create component, don't render the passed component if isLoading or error
const GroupProfile: React.FC<{
  data: SpotifyData[];
  orgData: SpotifyData[];
}> = ({ data, orgData }) => {
  // const [range, setRange] = useState<number[]>([0, 100]);
  const [filteredData, setFilteredData] = useState<SpotifyData[]>([]);

  const durData = filteredData.map((track) => ({
    group: "duration",
    value: track.duration_s,
  }));

  const tempoData = filteredData.map((track) => ({
    group: "tempo",
    value: track.tempo,
  }));

  return (
    <div className="flex h-[48rem] w-[110rem] flex-col items-center justify-center rounded-b-xl rounded-tr-3xl border-4 border-[#274c77] bg-white p-4 shadow-md shadow-gray-800">
      <div className="flex h-full w-full items-center justify-center   bg-white">
        <div className="flex h-full w-[26rem] items-center justify-center justify-self-center">
          <TopTracks data={filteredData} />
        </div>

        <div className="flex h-full w-min flex-col items-center justify-center border-x-2 bg-white">
          <div className="flex h-min w-min items-center justify-center p-4">
            <TrackKeys data={filteredData} />
          </div>
          <div className="flex h-full w-full flex-col justify-evenly border-t-2  p-4">
            <div className="flex h-min w-full flex-col justify-center gap-2">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-[#274c77]">
                <PiMetronome className="h-8 w-8" />
                Tempo (BPM)
              </h1>
              <div className="flex h-[6rem] w-full items-center justify-center">
                <PopularBoxPlot data={tempoData} colors={["#2a9d8f"]} />
              </div>
            </div>
            <div className="flex h-min w-full flex-col justify-center gap-2">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-[#274c77]">
                <PiTimer className="h-8 w-8" />
                Duration
              </h1>
              <div className="flex h-[6rem] w-full items-center justify-center">
                <DurationBoxPlot data={durData} colors={["#e9c46a"]} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex h-full w-full items-center justify-center p-4">
            <TrackFilter
              data={data}
              filteredData={filteredData}
              setFilteredData={setFilteredData}
            />
          </div>

          <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-4 border-t-2 p-4">
            <div className="col-start-3 row-span-2 row-start-1 flex h-full items-center justify-center">
              <TrackExplicit data={filteredData} />
            </div>
            <TrackScores data={filteredData} orgData={orgData} />
          </div>
        </div>
      </div>
    </div>
  );
};

//create component, don't render the passed component if isLoading or error
const CheckBeforeRender: React.FC<{
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}> = ({ isLoading, error, children }) => {
  if (error)
    return (
      <div className="grid h-screen w-screen place-items-center text-4xl">
        <h1>Error: {error}</h1>
      </div>
    );

  if (isLoading)
    return (
      <div className="grid h-screen w-screen place-items-center text-4xl">
        <h1>Loading...</h1>
      </div>
    );

  return <>{children}</>;
};

function App() {
  const {
    data: data,
    error: error,
    isLoading: isLoading,
  } = useSWR<SpotifyData[]>(
    "https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/spotify_dataset.csv",
    SpotifyDataFetcher,
    {
      revalidateOnFocus: false,
    },
  );
  const [groups, setGroups] = useState<Collection[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  // const [selected, setSelected] = useState<Collection>();
  //get group by id
  const selected = groups.find((group) => group.id === selectedId);
  useEffect(() => {
    if (!data) return;
    if (groups.length !== 0) {
      // setSelected(groups[groups.length - 1]);
      setSelectedId(groups[groups.length - 1].id);
    }
  }, [data, groups]);

  useEffect(() => {
    if (!data) return;

    if (groups.length === 0) {
      //datas with unique data id
      const uniqueDataMap = new Map<string, SpotifyData>();
      const uniqueData = new Array<SpotifyData>();
      data.forEach((d) => {
        if (!uniqueDataMap.has(d.track_id)) {
          uniqueDataMap.set(d.track_id, d);
          uniqueData.push(d);
        }
      });

      setGroups([
        {
          id: "All Tracks",
          name: "All Tracks",
          data: uniqueData,
        },
        {
          id: "Mandopop",
          name: "Mandopop",
          data: uniqueData.filter((d) => d.track_genre === "mandopop"),
        },
        {
          id: "Pop",
          name: "Pop",
          data: uniqueData.filter((d) => d.track_genre === "pop"),
        },
        {
          id: "Jay Chou",
          name: "Jay Chou",
          data: uniqueData.filter((d) => d.artists.includes("Jay Chou")),
        },
        {
          id: "Billie Eilish",
          name: "Billie Eilish",
          data: uniqueData.filter((d) => d.artists.includes("Billie Eilish")),
        },
        {
          id: "Yoasobi",
          name: "Yoasobi",
          data: uniqueData.filter((d) => d.artists.includes("YOASOBI")),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#a3cef1]">
      <div className="invisible"></div>
      <div className="flex h-full w-full items-center justify-center">
        <CheckBeforeRender isLoading={isLoading && !selected} error={error}>
          {data && selected && (
            <div className="flex h-min w-min flex-col">
              <Suspense fallback={<div>Loading...</div>}>
                <ul className="flex h-[8rem] w-full items-end gap-2 pr-1 pt-2">
                  <li className="mr-4 flex h-min w-[14rem] items-center justify-center rounded-tl-lg rounded-tr-3xl bg-[#274c77] px-8 py-4 shadow-md shadow-gray-800">
                    <h1 className="text-left text-2xl font-bold text-[#e7ecef] drop-shadow-md">
                      <span className="text-4xl">S</span>
                      potify
                      <span className="text-4xl"> 🎵</span>
                      <br />
                      <span className="text-4xl">T</span>
                      <span className="text-3xl">rackalysis</span>
                    </h1>
                  </li>

                  {groups.map((group) => {
                    if (group.id === selected.id) {
                      return (
                        <li
                          key={group.id}
                          className="relative flex h-[4rem] w-[10rem] items-center justify-center rounded-t-2xl border-4 border-[#274c77] bg-white px-1 pt-1 shadow-md shadow-gray-800"
                        >
                          <Tooltip content={group.name}>
                            <h1 className="line-clamp-1 px-1 text-2xl font-bold text-[#274c77]">
                              {group.name}
                            </h1>
                          </Tooltip>
                          <div className="absolute top-[3rem] z-10 h-[2rem] w-[9.5rem] bg-white" />
                          {group.id !== "All Tracks" && (
                            <PiTrashFill
                              className="absolute right-0 top-12 z-10 h-8 w-8 text-[#274c77] hover:cursor-pointer hover:text-[#8d0801]"
                              onClick={() => {
                                setGroups(
                                  groups.filter((g) => g.id !== group.id),
                                );
                                setSelectedId("All Tracks");
                              }}
                            />
                          )}
                        </li>
                      );
                    }
                    return (
                      <li
                        key={group.id}
                        className="flex h-[4rem] w-[10rem] items-center justify-center rounded-t-2xl border-4 border-white bg-white px-1 pt-1 shadow-md shadow-gray-800 hover:cursor-pointer hover:border-transparent hover:bg-gray-300"
                        onClick={() => {
                          setSelectedId(group.id);
                          console.log(group.id);
                        }}
                      >
                        <Tooltip content={group.name}>
                          <h1 className="line-clamp-1 px-1 text-2xl font-bold text-gray-800">
                            {group.name}
                          </h1>
                        </Tooltip>
                      </li>
                    );
                  })}
                  {groups.length < 9 && (
                    <GroupBuilder
                      data={data}
                      groups={groups}
                      setGroups={setGroups}
                    ></GroupBuilder>
                  )}
                </ul>

                <GroupProfile data={selected.data} orgData={data} />
              </Suspense>
            </div>
          )}
        </CheckBeforeRender>
      </div>

      <footer className="fixed right-0 top-0 m-2">
        <p>Built by 312552021</p>
      </footer>
    </div>
  );
}

export default App;
