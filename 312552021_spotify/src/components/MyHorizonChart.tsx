import { useMemo } from "react";
import { SeoulAirPollutionData } from "../utils/dataHandler";
import D3HorizonChart from "./D3HorizonChart";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HCBlock: React.FC<{
  data: SeoulAirPollutionData[];
  code: number;
  yKey: string;
}> = ({ data, code, yKey }) => {
  const filteredPairs = useMemo(() => {
    const filterData = data.filter((r) => r.Code === code);
    return filterData.map((r) => {
      return [r.Date, r[yKey] as number] as [Date, number];
    });
  }, [data, code, yKey]);

  let yRange = [];
  let colors = [];
  if (yKey === "SO2") {
    yRange = [0, 0.05]; //[0, 0.1];
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else if (yKey === "NO2") {
    yRange = [0, 0.1]; //[0, 0.1];
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else if (yKey === "O3") {
    yRange = [0, 0.45]; //[0, 0.1];
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else if (yKey === "CO") {
    yRange = [0, 6]; //[0, 3];
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else if (yKey === "PM10") {
    yRange = [0, 80]; //[0, 200]
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else if (yKey === "PM25") {
    yRange = [0, 40]; //[0, 200]
    // colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"];
  } else {
    yRange = [0, 10];
    // colors = ["#00E400", "#FFFF00", "#FF7E00", "#FF0000", "#8F3F97", "#FF0D0D"];
  }
  colors = [
    "#00E400",
    "#FFFF00CC",
    "#FF7E00BB",
    "#FF0000AA",
    "#8F3F97AA",
    "#7E002388",
  ];

  return (
    <div className="rounded-xl border-2 font-bold text-purple-900 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg">
      <D3HorizonChart
        id={`${yKey}_${code}`}
        dataSet={filteredPairs}
        height={30}
        // width={1000}
        yRange={[yRange[0], yRange[1]]}
        title={`${code}-${yKey}`}
        titleColor={"black"}
        titleFontSize={16}
        colors={colors}
      />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MyHorizonChart: React.FC<{
  data: SeoulAirPollutionData[];
  orderBy: string;
}> = ({ data, orderBy }) => {
  //101 ~ 125
  const codeList = Array.from({ length: 25 }, (_, i) => i + 101);
  const keyList = ["SO2", "NO2", "O3", "CO", "PM10", "PM25"];

  // const yMax = []; // max value of each key
  // const yMin = []; // min value of each key

  // keyList.forEach((key) => {
  //   yMax.push(
  //     data.reduce((acc, cur) => {
  //       return Math.max(acc, cur[key] as number);
  //     }, 0),
  //   );
  //   yMin.push(
  //     data.reduce((acc, cur) => {
  //       return Math.min(acc, cur[key] as number);
  //     }, 0),
  //   );
  // });

  // yMax.forEach((v, i) => {
  //   yMax[i] = Math.ceil(v * 10) / 10;
  // });
  // yMin.forEach((v, i) => {
  //   yMin[i] = Math.floor(v * 10) / 10;
  // });

  // console.log(keyList);
  // console.log(yMax, yMin);

  //make all the combination of code and key, as a list of [code, key]
  // const sortOrder = "key"; // "code" or "key"

  return (
    //center
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll rounded-xl border-2 border-gray-500 bg-white">
      {orderBy === "Code"
        ? codeList.map((code) => {
            return (
              <div
                key={code}
                className="rounded-xl border-2 border-gray-500 bg-gray-100"
              >
                {keyList.map((key) => {
                  return (
                    <HCBlock
                      data={data}
                      code={code}
                      yKey={key}
                      key={`${key}_${code}`}
                    />
                  );
                })}
              </div>
            );
          })
        : keyList.map((key) => {
            return (
              <div
                key={key}
                className="rounded-xl border-2 border-gray-500 bg-gray-100"
              >
                {codeList.map((code) => {
                  return (
                    <HCBlock
                      data={data}
                      code={code}
                      yKey={key}
                      key={`${key}_${code}`}
                    />
                  );
                })}
              </div>
            );
          })}
    </div>
  );
};

export default MyHorizonChart;
