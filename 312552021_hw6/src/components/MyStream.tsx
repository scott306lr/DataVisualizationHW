import { ResponsiveStream } from "@nivo/stream";
import type { HousePropertySalesData } from "../utils/dataHandler";
import { parseDate } from "../utils/utils";
import { forwardRef, useImperativeHandle, useState } from "react";

type HousePropertySalesStreamData = {
  [key: string]: number[];
  "House/Bedrooms: 2": number[];
  "House/Bedrooms: 3": number[];
  "House/Bedrooms: 4": number[];
  "House/Bedrooms: 5": number[];
  "Unit/Bedrooms: 1": number[];
  "Unit/Bedrooms: 2": number[];
  "Unit/Bedrooms: 3": number[];
};

export type RestartHandle = {
  restart: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyStream = forwardRef<
  RestartHandle,
  { data: HousePropertySalesData[]; aggregateBy: string; deleteMode: boolean }
>(({ data, aggregateBy, deleteMode }, ref) => {
  //
  const streamData = data.reduce(
    (acc, cur) => {
      const saleDate =
        aggregateBy === "Month"
          ? cur["Sale Date"]
          : parseDate(cur["Sale Date"]).getFullYear().toString();
      const key = `${cur["Type"]} / bedrooms: ${cur["Bedrooms"]}`;

      const acc_date = acc[saleDate] || {
        "house / bedrooms: 2": [],
        "house / bedrooms: 3": [],
        "house / bedrooms: 4": [],
        "house / bedrooms: 5": [],
        "unit / bedrooms: 1": [],
        "unit / bedrooms: 2": [],
        "unit / bedrooms: 3": [],
      };
      acc_date[key].push(cur["MA"]);

      acc[saleDate] = acc_date;
      return acc;
    },
    {} as Record<string, HousePropertySalesStreamData>,
  );

  const streamDataArray = Object.entries(streamData)
    .map(([key, value]) => {
      const average = Object.entries(value).reduce(
        (acc, [key, value]) => {
          acc[key] = value.reduce((acc, cur) => acc + cur, 0) / value.length;
          //handle NaN

          if (isNaN(acc[key])) {
            acc[key] = 0;
          }
          return acc;
        },
        {} as Record<string, number>,
      );
      return {
        "Sale Date": key,
        ...average,
      };
    })
    .sort(
      (a, b) =>
        parseDate(a["Sale Date"]).getTime() -
        parseDate(b["Sale Date"]).getTime(),
    );

  const [keyArray, setKeyArray] = useState([
    "house / bedrooms: 5",
    "house / bedrooms: 4",
    "house / bedrooms: 3",
    "house / bedrooms: 2",
    "unit / bedrooms: 1",
    "unit / bedrooms: 2",
    "unit / bedrooms: 3",
  ]);

  useImperativeHandle(ref, () => ({
    restart() {
      setKeyArray([
        "house / bedrooms: 5",
        "house / bedrooms: 4",
        "house / bedrooms: 3",
        "house / bedrooms: 2",
        "unit / bedrooms: 1",
        "unit / bedrooms: 2",
        "unit / bedrooms: 3",
      ]);
    },
  }));

  return (
    //center
    <div className="flex h-full w-full flex-col justify-center rounded-xl border-2 border-gray-500 bg-white">
      <ResponsiveStream
        // scale y axis min/max range to -100 ~ 100
        // animate={
        // curve="monotoneX"
        motionConfig="stiff"
        theme={{
          axis: {
            legend: { text: { fontSize: 24 } },
            ticks: { text: { fontSize: 18 } },
          },
          labels: {
            text: { fontSize: 18, fontWeight: "bold" },
          },
          legends: {
            text: { fontSize: 18 },
            title: { text: { fontSize: 16 } },
          },
        }}
        data={streamDataArray as never[]}
        keys={keyArray}
        margin={{ top: 50, right: 230, bottom: 85, left: 110 }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 8,
          tickPadding: 10,
          tickRotation: -18,
          legend: "Sales Date",
          legendOffset: 65,
          format: (d) => {
            if (aggregateBy === "Month" && d % 3) {
              return "";
            }
            return streamDataArray[d]?.["Sale Date"];
          },
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Moving Average of Median Price",
          legendOffset: -80,
          format: (d) => {
            const abs = Math.abs(d);
            // scientific notation
            if (abs >= 1e6) {
              return `${d / 1e6}M`;
            }
            if (abs >= 1e3) {
              return `${d / 1e3}K`;
            }
            return d;
          },
        }}
        enableGridX={false}
        enableGridY={true}
        offsetType="silhouette"
        colors={({ id }) => {
          // blue with different variants
          if (id === "house / bedrooms: 2") return "#00B4D8";
          if (id === "house / bedrooms: 3") return "#0077B6";
          if (id === "house / bedrooms: 4") return "#023E8A";
          if (id === "house / bedrooms: 5") return "#03045E";
          // red variants
          if (id === "unit / bedrooms: 1") return "#d8f3dc";
          if (id === "unit / bedrooms: 2") return "#52b788";
          if (id === "unit / bedrooms: 3") return "#40916c";
          else return "#000000";
        }}
        fillOpacity={0.85}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            translateX: 210,
            itemWidth: 190,
            itemHeight: 20,
            // itemTextColor: deleteMode ? //red if delete mode, "#999999" otherwise,
            itemTextColor: deleteMode ? "#e63946" : "#999999",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000000",
                },
              },
            ],
            onClick: (d) => {
              // switch with the next id
              if (keyArray.length > 1) {
                const index = keyArray.indexOf(d.id as string);
                const newArray = [...keyArray];
                const temp = newArray[index];

                console.log(index);
                if (deleteMode) {
                  // remove the id
                  newArray.splice(index, 1);
                  setKeyArray(newArray);
                } else {
                  if (index === keyArray.length - 1) {
                    // swap with the first element
                    newArray[index] = newArray[0];
                    newArray[0] = temp;
                    setKeyArray(newArray);
                  } else {
                    // swap with the next element
                    newArray[index] = newArray[index + 1];
                    newArray[index + 1] = temp;
                    setKeyArray(newArray);
                  }
                }
              }
            },
          },
        ]}
      />
    </div>
  );
});

export default MyStream;
