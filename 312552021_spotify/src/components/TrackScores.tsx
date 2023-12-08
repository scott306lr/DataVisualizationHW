import React, { useMemo } from "react";
import { SpotifyData } from "../utils/dataHandler";
import MyWaffle from "./MyWaffle";
import { Tooltip } from "flowbite-react";

interface IProps {
  data: SpotifyData[];
  scoreKey: string;
  orgData: SpotifyData[];
}

const KeyScore: React.FC<IProps> = ({ data, scoreKey, orgData }) => {
  // Sort orgData by scoreKey
  const sortedOrgData = useMemo(() => {
    return [...orgData].sort(
      (a, b) => (a[scoreKey] as number) - (b[scoreKey] as number),
    );
  }, [orgData, scoreKey]);

  const sortedScore = useMemo(() => {
    return data.map((d) => d[scoreKey] as number).sort((a, b) => a - b);
  }, [data, scoreKey]);

  const len = sortedOrgData.length;
  const [bound_vl, bound_l, bound_m, bound_h] = [
    sortedOrgData[Math.floor(len * 0.2)][scoreKey] as number,
    sortedOrgData[Math.floor(len * 0.4)][scoreKey] as number,
    sortedOrgData[Math.floor(len * 0.6)][scoreKey] as number,
    sortedOrgData[Math.floor(len * 0.8)][scoreKey] as number,
  ];

  // Count the tracks in each category
  const [vl, l, m, h, vh] = sortedScore.reduce(
    (acc, score) => {
      if (score < bound_vl) acc[0]++;
      else if (score < bound_l) acc[1]++;
      else if (score < bound_m) acc[2]++;
      else if (score < bound_h) acc[3]++;
      else acc[4]++;
      return acc;
    },
    [0, 0, 0, 0, 0],
  );

  const percentile = useMemo(() => {
    const findPercentile = (score: number) => {
      let low = 0,
        high = sortedOrgData.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if ((sortedOrgData[mid][scoreKey] as number) < score) {
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      return (low / sortedOrgData.length) * 100;
    };

    // Calculate the median percentile
    const score = sortedScore[Math.floor(sortedScore.length / 2)];
    const p = findPercentile(score);

    return Math.round(p * 100) / 100;
  }, [sortedScore, sortedOrgData, scoreKey]);

  const str = (() => {
    if (data.length === 0) return "No data";
    else if (percentile < 20) return "Very low";
    else if (percentile < 40) return "Low";
    else if (percentile < 60) return "Moderate";
    else if (percentile < 80) return "High";
    else return "Very high";
  })();

  const meanings = {
    instrumentalness:
      "The higher the value, the more likely the track contains no vocals.",
    speechiness:
      "The higher the value, the more likely the track contains spoken words.",
    liveness:
      "The higher the value, the more likely the track was performed live.",
    acousticness:
      "The higher the value, the more likely the track is acoustic.",
    danceability:
      "The higher the value, the easier it is to dance to this track.",
    valence: "The higher the value, the more positive mood for the track.",
    energy: "The higher the value, the more energetic the track.",
  };

  const inform = meanings[scoreKey as keyof typeof meanings];

  const waffleData = [
    {
      id: "Very high",
      label: "Very high",
      value: vh,
    },
    {
      id: "High",
      label: "High",
      value: h,
    },
    {
      id: "Moderate",
      label: "Moderate",
      value: m,
    },
    {
      id: "Low",
      label: "Low",
      value: l,
    },
    {
      id: "Very low",
      label: "Very low",
      value: vl,
    },
  ];

  return (
    <div className="items-left flex h-min w-[14rem] flex-col justify-center gap-2 rounded-xl bg-white px-4 py-2 shadow-md shadow-gray-400">
      <Tooltip content={inform} placement="top">
        <h1 className="text-xl text-[#274c77]">
          {scoreKey[0].toUpperCase() + scoreKey.slice(1)}
        </h1>
      </Tooltip>
      <div className="flex h-min items-center gap-2">
        <div className="flex h-[4rem] w-[4rem] flex-row items-center justify-center rounded-xl">
          {/* <MyBoxPlot data={groups} /> */}
          <MyWaffle data={waffleData} total={data.length} />
        </div>
        <Tooltip
          content={`It's median ranks in the top ${percentile}% of all tracks`}
          placement="bottom"
        >
          <h1
            className="h-min w-min text-clip text-2xl font-bold"
            style={
              data.length === 0
                ? { color: "#274c77" }
                : percentile < 20
                  ? { color: "#f94144" }
                  : percentile < 40
                    ? { color: "#f8961e" }
                    : percentile < 60
                      ? { color: "#f9c74f" }
                      : percentile < 80
                        ? { color: "#90be6d" }
                        : { color: "#577590" }
            }
          >
            <span className="truncate text-2xl font-bold">{str}</span>
            {data.length !== 0 && ` ${percentile}%`}
          </h1>
        </Tooltip>
      </div>
    </div>
  );
};

const TrackScores: React.FC<{
  data: SpotifyData[];
  orgData: SpotifyData[];
}> = ({ data, orgData }) => {
  const keys = [
    "instrumentalness",
    "speechiness",
    "liveness",
    "acousticness",
    "danceability",
    "valence",
    "energy",
  ];

  // const orgDataRandomSample = useMemo(() => {
  //   return [...orgData].sort(() => Math.random() - 0.5).slice(0, 2000);
  // }, [orgData]);

  return (
    <>
      {keys.map((key) => {
        return (
          <KeyScore key={key} data={data} scoreKey={key} orgData={orgData} />
        );
      })}
    </>
  );
};

export default TrackScores;
