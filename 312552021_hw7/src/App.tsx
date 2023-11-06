// import { useState } from "react";
import { ReactNode, Suspense, useMemo, useState } from "react";
import "./App.css";
import {
  SeoulAirPollutionData,
  SeoulAirPollutionFetcher,
} from "./utils/dataHandler";
import useSWR from "swr";

import { MyInformModal } from "./components/MyInformModal";

import { Button, Tooltip } from "flowbite-react";
import MyModal from "./components/MyModal";
import MyHorizonChart from "./components/MyHorizonChart";
import { Datepicker } from "flowbite-react";
import { customDatepickerTheme } from "./utils/theme";

interface IProps {
  title: string | undefined;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | undefined;
}

export const HowToUse: React.FC<IProps> = ({
  title,
  size = "2xl",
  children,
}) => {
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);

  return (
    <>
      <h1
        className="cursor-pointer text-center text-2xl font-bold text-white/80 hover:text-white"
        onClick={() => setOpenModal("dismissible")}
      >
        How To Use ?
      </h1>
      <MyModal
        title={title}
        openModal={openModal}
        setOpenModal={setOpenModal}
        size={size}
      >
        {children}
      </MyModal>
    </>
  );
};

//create component, don't render the passed component if isLoading or error
const CheckBeforeRender: React.FC<{
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}> = ({ isLoading, error, children }) => {
  if (isLoading)
    return (
      <div className="grid h-screen w-screen place-items-center text-4xl">
        <h1>Loading...</h1>
      </div>
    );

  if (error)
    return (
      <div className="grid h-screen w-screen place-items-center text-4xl">
        <h1>Error: {error}</h1>
      </div>
    );

  return <>{children}</>;
};

function App() {
  const {
    data: data,
    error: error,
    isLoading: isLoading,
  } = useSWR(
    "http://vis.lab.djosix.com:2023/data/air-pollution.csv",
    SeoulAirPollutionFetcher,
  );

  const [orderBy, setOrderBy] = useState("Code");
  const [startDate, setStartDate] = useState<Date>(new Date(2017, 0, 1));
  const [endDate, setEndDate] = useState<Date>(new Date(2019, 11, 31));

  const filteredData = useMemo(() => {
    if (!data) return undefined;

    return data.filter((d: SeoulAirPollutionData) => {
      const date = new Date(d["Date"]);
      return date >= startDate && date <= endDate;
    });
  }, [data, startDate, endDate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-100">
      <div className="invisible"></div>
      <CheckBeforeRender isLoading={isLoading} error={error}>
        {data && (
          <div className="h-[50rem] w-[100rem] flex-col place-items-center space-y-2 pb-32">
            <div className="grid w-full grid-cols-3 items-center justify-center rounded-xl bg-slate-700 p-4">
              <div className="col-start-1 flex flex-grow items-center justify-start space-x-2 pl-6">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-gray-500 bg-gray-100 text-center font-bold">
                  From:
                  <Datepicker
                    theme={customDatepickerTheme}
                    // inline={true}
                    className="h-full w-full items-center justify-center text-center font-bold"
                    minDate={new Date(2017, 0, 1)}
                    maxDate={endDate}
                    defaultDate={new Date(2017, 0, 1)}
                    value={startDate.toDateString()}
                    onSelectedDateChanged={(date) => setStartDate(date)}
                  />
                </div>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-gray-500 bg-gray-100 text-center font-bold">
                  To:
                  <Datepicker
                    theme={customDatepickerTheme}
                    // inline={true}
                    className="h-full w-full items-center justify-center text-center font-bold"
                    minDate={startDate}
                    maxDate={new Date(2019, 11, 31)}
                    defaultDate={new Date(2019, 11, 31)}
                    value={endDate.toDateString()}
                    onSelectedDateChanged={(date) => setEndDate(date)}
                  />
                </div>
                <Tooltip
                  style="light"
                  content="Order Horizon Charts By District/Pollutant"
                  arrow={false}
                  className="text-xl"
                >
                  <Button
                    // gradientDuoTone="cyanToBlue"
                    gradientDuoTone="cyanToBlue"
                    className="h-12 w-12 items-center justify-center text-center font-bold "
                    onClick={() =>
                      setOrderBy((prev) => (prev === "Key" ? "Code" : "Key"))
                    }
                  >
                    {orderBy === "Key" ? (
                      <span className="text-2xl"> P </span>
                    ) : (
                      <span className="text-2xl"> D </span>
                    )}
                  </Button>
                </Tooltip>
              </div>
              <h1 className="col-start-2 flex items-center justify-center text-center text-3xl font-bold text-white">
                Air Pollution in Seoul
                <br />
                2017-2019
                <MyInformModal
                  title="Air Pollution in Seoul 2017-2019"
                  size="3xl"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-left text-lg">
                      The{" "}
                      <a
                        href="https://www.kaggle.com/datasets/bappekim/air-pollution-in-seoul"
                        target="_blank"
                        className="font-bold text-blue-500 underline hover:text-blue-700"
                      >
                        Air Pollution in Seoul
                      </a>{" "}
                      dataset provides average values for six pollutants (SO2,
                      NO2, CO, O3, PM10, PM2.5).
                      <li className="ml-4 list-disc">
                        Data were measured for 25 districts in Seoul.
                      </li>
                      <li className="ml-4 list-disc">
                        Data were measured every hour during 2017-2019.
                      </li>
                      <li className="ml-4 list-disc">
                        The visualization aggregated hourly data into daily
                        summaries by mean.
                      </li>
                      <br />
                      <p className="text-lg font-bold">
                        What does the color mean?
                      </p>
                      <p className="text-lg">
                        The colors of each air pollutant are determined by the{" "}
                        <a
                          href="https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf"
                          target="_blank"
                          className="font-bold text-blue-500 underline hover:text-blue-700"
                        >
                          Technical Assistance Document for the Air Quality
                          Index (AQI)
                        </a>
                        , below is the definition of each color.
                        <br />
                        <br />
                        {/* Green  */}
                        <p className="text-lg">
                          <span className="font-bold text-green-500">
                            Green (AQI 0-50)
                          </span>{" "}
                          means the air quality is good.
                        </p>
                        {/* Yellow  */}
                        <p className="text-lg">
                          <span className="font-bold text-yellow-500">
                            Yellow (AQI 51-100)
                          </span>{" "}
                          means moderate air quality.
                        </p>
                        {/* Orange  */}
                        <p className="text-lg">
                          <span className="font-bold text-orange-500">
                            Orange (AQI 101-150)
                          </span>{" "}
                          means unhealthy for sensitive groups.
                        </p>
                        {/* Red  */}
                        <p className="text-lg">
                          <span className="font-bold text-red-500">
                            Red (AQI 151-200)
                          </span>{" "}
                          means unhealthy.
                        </p>
                        {/* Purple  */}
                        <p className="text-lg">
                          <span className="font-bold text-purple-500">
                            Purple (AQI 201-300)
                          </span>{" "}
                          means very unhealthy.
                        </p>
                        {/* Maroon  */}
                        <p className="text-lg">
                          <span className="font-bold text-[#7E0023]">
                            Maroon (AQI 301-500)
                          </span>{" "}
                          means hazardous.
                        </p>
                        <br />
                        <p className="text-lg">
                          The report further gave the guidance of the
                          pollutant-specific AQI breakpoints (Table 4.). This
                          visualization follows the guidance to determine the
                          color of each pollutant.
                        </p>
                      </p>
                    </p>
                  </div>
                </MyInformModal>
              </h1>
              <div className="col-start-3 flex flex-grow justify-end pr-6">
                <HowToUse title="How To Use ?" size="2xl">
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <p className="text-left text-lg">
                      <span className="">
                        To dive deeper and customize your view...
                      </span>
                      <br />
                      <br />
                      On the top left corner:
                      <li className="ml-4 list-disc">
                        You can set the date visualization range (left).
                      </li>
                      <li className="ml-4 list-disc">
                        Use the “D/P” button (right) to switch the grouping
                        order between District/Pollutant.
                      </li>
                      <br />
                      To grasp the significance of the color and gain further
                      insights into the dataset, please click on the tooltip
                      next to the title.
                    </p>
                  </div>
                </HowToUse>
              </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <MyHorizonChart data={filteredData} orderBy={orderBy} />
            </Suspense>
          </div>
        )}
      </CheckBeforeRender>

      <footer className="fixed bottom-0 right-0 m-2">
        <p>Built by 312552021</p>
      </footer>
    </div>
  );
}

export default App;
