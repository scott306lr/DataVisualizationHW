import { ResponsiveBar } from "@nivo/bar";
import { UniversityRankingData } from "../utils/dataHandler";
import { useState } from "react";

const MyBar: React.FC<{ data: UniversityRankingData[]; sortOrder: string }> = ({
  data,
  sortOrder,
}) => {
  const [sortingKey, setSortingKey] = useState("Teaching");

  const [keyArray, setKeyArray] = useState([
    "Teaching",
    "Research",
    "Citations",
    "Industry Income",
    "International",
  ]);
  const topSortedData = data
    .map((e) => {
      return {
        ...e,
        "Teaching Color": "#6096B4",
        "Research Color": "#93BFCF",
        "Citations Color": "#BDCDD6",
        "Industry Income Color": "#EEE9DA",
        "International Color": "#D9E2E5",
      };
    })
    .sort((a, b) => {
      if (sortOrder === "Ascend") {
        const aSortingKey = a[sortingKey as keyof typeof a] as number;
        const bSortingKey = b[sortingKey as keyof typeof b] as number;
        if (aSortingKey !== bSortingKey) {
          return aSortingKey - bSortingKey;
        } else {
          const aTotalScore = keyArray.reduce((acc, cur) => {
            return acc + (a[cur as keyof typeof a] as number);
          }, 0);

          const bTotalScore = keyArray.reduce((acc, cur) => {
            return acc + (b[cur as keyof typeof b] as number);
          }, 0);

          return aTotalScore - bTotalScore;
        }
      } else {
        const aSortingKey = a[sortingKey as keyof typeof a] as number;
        const bSortingKey = b[sortingKey as keyof typeof b] as number;
        if (aSortingKey !== bSortingKey) {
          return bSortingKey - aSortingKey;
        } else {
          const aTotalScore = keyArray.reduce((acc, cur) => {
            return acc + (a[cur as keyof typeof a] as number);
          }, 0);

          const bTotalScore = keyArray.reduce((acc, cur) => {
            return acc + (b[cur as keyof typeof b] as number);
          }, 0);

          return bTotalScore - aTotalScore;
        }
      }
    })
    .slice(0, 30)
    .reverse();

  return (
    //center
    <div className="flex h-full w-full justify-center rounded-xl border-2 border-gray-500 bg-white">
      <ResponsiveBar
        theme={{
          axis: {
            legend: { text: { fontSize: 20 } },
            ticks: { text: { fontSize: 18 } },
          },
          labels: {
            text: { fontSize: 14, fontWeight: "bold" },
          },
          legends: {
            text: { fontSize: 16 },
            title: { text: { fontSize: 16 } },
          },
        }}
        data={topSortedData}
        keys={keyArray}
        indexBy="Name"
        margin={{ top: 50, right: 200, bottom: 80, left: 380 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={({ id, data }) => {
          return data[`${id} Color` as keyof typeof data] as string;
        }}
        // colorBy="indexValue"
        // borderColor={{
        //   from: "color",
        //   modifiers: [["darker", 2]],
        // }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 12,
          tickPadding: 5,
          tickRotation: 0,
          legend: `Total Score (Showing Top 30 of "${sortingKey}")`,
          legendPosition: "middle",
          legendOffset: 56,
        }}
        axisLeft={{
          tickSize: 12,
          tickPadding: 8,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        enableGridX={true}
        enableGridY={false}
        labelSkipWidth={10}
        labelSkipHeight={10}
        // labelTextColor={{
        //   from: "color",
        //   modifiers: [["darker", 1.6]],
        // }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 170,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: 140,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,

            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            onClick: (d) => {
              // on click, sort the data by the clicked key
              // if the clicked key is already the sorting key, reverse the order
              if (d.id !== sortingKey) {
                // if the clicked key is not the sorting key, set the sorting key to the clicked key
                setSortingKey(d.id as string);

                // move the id in keyArray to the front
                const index = keyArray.indexOf(d.id as string);
                const newArray = [...keyArray];
                newArray.splice(index, 1);
                newArray.unshift(d.id as string);
                setKeyArray(newArray);
              }
            },
          },
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 172,
            translateY: 50,
            itemsSpacing: 5,
            itemWidth: 150,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 0,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            data: [
              {
                id: "A",
                label: "Sort By Total Score",
              },
            ],
            onClick: () => {
              // on click, sort the data by the clicked key
              // if the clicked key is already the sorting key, reverse the order
              if (sortingKey !== "Total Score") {
                // if the clicked key is not the sorting key, set the sorting key to the clicked key
                setSortingKey("Total Score");
              }
            },
          },
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 170,
            translateY: -128,
            itemsSpacing: 5,
            itemWidth: 150,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 0,
            data: [
              {
                id: "A",
                label: "Click Key to Sort",
              },
            ],
          },
        ]}
        // role="application"
        // ariaLabel="Nivo bar chart demo"
        // barAriaLabel={(e) =>
        //   e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        // }
        tooltip={({ id, value, color, data }) => (
          <div
            style={{
              // color,
              padding: 12,
              background: "white",
              borderRadius: 4,
            }}
          >
            {/* color rectangle */}
            <div
              style={{
                width: 12,
                height: 12,
                background: color,
                marginRight: 8,
                display: "inline-block",
              }}
            />
            {id} - {data.FullName}: <strong>{value}</strong>
          </div>
        )}
      />
    </div>
  );
};

export default MyBar;
