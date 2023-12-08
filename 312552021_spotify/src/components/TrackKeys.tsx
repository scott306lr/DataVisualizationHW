import React from "react";
import { SpotifyData } from "../utils/dataHandler";
import { dataUniqueKeyValueCount } from "../utils/utils";
import MyPieChart from "./MyPieChart";
import MyMusicBar from "./MyMusicBar";
import { PiPianoKeys } from "react-icons/pi";

// Define the type for the object that acc will be
interface AccType {
  [id: string]: {
    major: number;
    minor: number;
    [id: string]: number;
  };
}

interface IProps {
  data: SpotifyData[];
}

const TrackKeys: React.FC<IProps> = ({ data }) => {
  const mode_cnt = dataUniqueKeyValueCount(data, "mode");
  const key_mode_cnt = dataUniqueKeyValueCount(data, "key_mode");
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
  const barDict = key_mode_cnt.reduce<AccType>(
    (acc, key_mode) => {
      const key = key_mode.key.slice(0, -6) as string;
      const mode = key_mode.key.slice(-5) as string;
      const value = mode === "major" ? key_mode.value : -key_mode.value;

      // console.log(key, mode, value);
      // acc[key] = { major: 0, minor: 0 };
      acc[key][mode] = value;
      return acc;
    },
    {
      C: { major: 0, minor: 0 },
      "C♯/D♭": { major: 0, minor: 0 },
      D: { major: 0, minor: 0 },
      "D♯/E♭": { major: 0, minor: 0 },
      E: { major: 0, minor: 0 },
      F: { major: 0, minor: 0 },
      "F♯/G♭": { major: 0, minor: 0 },
      G: { major: 0, minor: 0 },
      "G♯/A♭": { major: 0, minor: 0 },
      A: { major: 0, minor: 0 },
      "A♯/B♭": { major: 0, minor: 0 },
      B: { major: 0, minor: 0 },
    },
  );

  // console.log(barDict);
  //convert dict to array
  const barData = Object.entries(barDict)
    .map(([key, value]) => {
      return {
        id: key,
        major: value.major,
        minor: value.minor,
      };
    })
    .sort((a, b) => {
      //find the index of the key in the key_order array
      return key_order.indexOf(a.id) - key_order.indexOf(b.id);
    });

  const pieData = mode_cnt
    .map((mode) => {
      return {
        id: mode.key,
        label: mode.key,
        value: mode.value,
      };
    })
    .sort((a) => {
      return a.id === "major" ? 1 : -1;
    });

  return (
    <div className="flex h-min w-min flex-col justify-between gap-2 ">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-[#274c77]">
        <PiPianoKeys className="h-8 w-8" />
        Keys/Mode
      </h1>
      <div className="flex h-full w-min flex-row items-center justify-center">
        <div className="flex h-full w-min flex-col items-center justify-center gap-2">
          <div className="flex h-[10rem] w-[14rem] items-center justify-center">
            <MyPieChart data={pieData} />
          </div>
          <span className="text-xl font-bold text-gray-800">
            Major/Minor Tracks
          </span>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex h-[12rem] w-[20rem] items-center justify-center">
            <MyMusicBar data={barData} />
          </div>
          <img
            src="piano_keys.png"
            alt="piano keys"
            className="mr-[1.5rem] h-[6rem] w-[15.5rem] border-2 border-black object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TrackKeys;
