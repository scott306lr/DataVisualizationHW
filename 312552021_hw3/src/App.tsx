// import { useState } from "react";
import { ReactNode, useMemo, useState } from "react";
import "./App.css";
import MyHeatMap from "./components/MyHeatMap";
import {
  AbaloneDataFetcher,
  getAbaloneCorrelationData,
} from "./utils/dataHandler";
import useSWR from "swr";
import { Flowbite, Tabs } from "flowbite-react";
import { customTabTheme } from "./utils/theme";
import {
  TbCirclesRelation,
  TbGenderMale,
  TbGenderFemale,
  TbBabyCarriage,
} from "react-icons/tb";

import MySlider from "./components/MySlider";
import MyModal from "./components/MyModal";

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
    "https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/abalone.data",
    AbaloneDataFetcher,
  ); //"abalone.data"

  const [activeTab, setActiveTab] = useState(0);
  const [value, setValue] = useState(0.4);
  const props = { activeTab, setActiveTab };

  const corrMale = useMemo(
    () => data && getAbaloneCorrelationData(data, "Sex", "M"),
    [data],
  );
  const corrFemale = useMemo(
    () => data && getAbaloneCorrelationData(data, "Sex", "F"),
    [data],
  );
  const corrInfant = useMemo(
    () => data && getAbaloneCorrelationData(data, "Sex", "I"),
    [data],
  );

  //slider
  const scroll_min = 0;
  const scroll_max = 1;
  const scroll_step = 0.05;

  //diverge threshold
  const scroll_legend = "Drag to adjust diverge threshold:";

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-blue-100">
      <CheckBeforeRender isLoading={isLoading} error={error}>
        {data && (
          <div className="flex h-fit w-[50rem] flex-col items-center justify-center overflow-hidden rounded-2xl border-4 border-gray-300 bg-white shadow-2xl">
            <h1 className="flex justify-center gap-2 px-8 pb-2 pt-48 text-center text-4xl font-bold">
              Correlation Matrix of Abalone Dataset
              <MyModal title="About">
                {/* Introduce what is the Abalone Dataset About, additional inf is in https://archive.ics.uci.edu/dataset/1/abalone */}
                <p className="text-lg">
                  The dataset employed in this project is the{" "}
                  <a
                    className="text-blue-500"
                    href="https://archive.ics.uci.edu/ml/datasets/Abalone"
                  >
                    Abalone Data Set
                  </a>
                  , <br />
                  a dataset designed for the purpose of predicting the age of
                  abalones based on their physical measurements.
                  <br />
                  <br />
                  Our analysis involves comparing the correlation matrices of
                  the features among different sexes of abalones, including
                  males, females, and infants.
                </p>
              </MyModal>
            </h1>
            <Flowbite theme={{ theme: customTabTheme }}>
              <Tabs.Group
                aria-label="Default tabs"
                style="underline"
                onActiveTabChange={(tab) => props.setActiveTab(tab)}
              >
                <Tabs.Item
                  disabled
                  title="Correlation Matrix by Sex"
                  icon={TbCirclesRelation}
                ></Tabs.Item>
                <Tabs.Item active title="Male" icon={TbGenderMale}>
                  <div className="h-4" />
                  <MySlider
                    legend={scroll_legend}
                    value={value}
                    setValue={setValue}
                    min={scroll_min}
                    max={scroll_max}
                    step={scroll_step}
                    disable={false}
                  />
                  <div className="h-[45rem] w-[45rem]">
                    <MyHeatMap data={corrMale} step={value} />
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Female" icon={TbGenderFemale}>
                  <div className="h-4" />
                  <MySlider
                    legend={scroll_legend}
                    value={value}
                    setValue={setValue}
                    min={scroll_min}
                    max={scroll_max}
                    step={scroll_step}
                    disable={false}
                  />
                  <div className="h-[45rem] w-[45rem]">
                    <MyHeatMap data={corrFemale} step={value} />
                  </div>
                </Tabs.Item>
                <Tabs.Item title="Infant" icon={TbBabyCarriage}>
                  <div className="h-4" />
                  <MySlider
                    legend={scroll_legend}
                    value={value}
                    setValue={setValue}
                    min={scroll_min}
                    max={scroll_max}
                    step={scroll_step}
                    disable={false}
                  />
                  <div className="h-[45rem] w-[45rem]">
                    <MyHeatMap data={corrInfant} step={value} />
                  </div>
                </Tabs.Item>
              </Tabs.Group>
            </Flowbite>
          </div>
        )}
      </CheckBeforeRender>
      {/* right bottom corner */}
      <footer className="fixed bottom-0 right-0 m-2">
        <p>Built by 312552021</p>
      </footer>
    </div>
  );
}

export default App;
