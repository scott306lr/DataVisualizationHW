// import { useState } from "react";
import { ReactNode, useRef, useState } from "react";
import "./App.css";
import { HousePropertySalesFetcher } from "./utils/dataHandler";
import useSWR from "swr";

import { MyInformModal } from "./components/MyInformModal";

import { Button, Tooltip } from "flowbite-react";
import MyModal from "./components/MyModal";
import MyStream, { RestartHandle } from "./components/MyStream";
import { MdRestartAlt, MdDelete, MdOutlineArrowUpward } from "react-icons/md";

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
  } = useSWR("ma_lga_12345.csv", HousePropertySalesFetcher);

  const [aggregateBy, setAggregateBy] = useState("Month");
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const restartRef = useRef<RestartHandle>(null);
  console.log(data && data);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-blue-100">
      <div className="invisible"></div>
      <CheckBeforeRender isLoading={isLoading} error={error}>
        {data && (
          <div className="h-[45rem] w-[90rem] flex-col place-items-center space-y-2 pb-32">
            <div className="grid w-full grid-cols-3 items-center justify-center rounded-xl bg-slate-700 p-4">
              <div className="col-start-1 flex flex-grow items-center justify-start space-x-2 pl-6">
                <Tooltip
                  style="light"
                  content="Restart Graph"
                  arrow={false}
                  className="text-xl"
                >
                  <Button
                    // gradientMonochrome="purple"
                    gradientDuoTone="cyanToBlue"
                    className="h-14 w-14 items-center justify-center"
                    onClick={() => {
                      restartRef.current?.restart();
                      setAggregateBy("Month");
                    }}
                  >
                    <MdRestartAlt className="h-12 w-12 p-2" />
                  </Button>
                </Tooltip>
                <Tooltip
                  style="light"
                  content="View Stream Graph by Month/Year"
                  arrow={false}
                  className="text-xl"
                >
                  <Button
                    // gradientDuoTone="cyanToBlue"
                    color="gray"
                    className="h-14 w-14 items-center justify-center text-center font-bold "
                    onClick={() =>
                      setAggregateBy(aggregateBy === "Month" ? "Year" : "Month")
                    }
                  >
                    {aggregateBy === "Month" ? (
                      <span className="text-2xl"> M </span>
                    ) : (
                      <span className="text-2xl"> Y </span>
                    )}
                  </Button>
                </Tooltip>
                <Tooltip
                  style="light"
                  content="Shift Up/Delete Legends On Click"
                  arrow={false}
                  className="text-xl"
                >
                  <Button
                    // gradientDuoTone="cyanToBlue"
                    color={deleteMode ? "failure" : "warning"}
                    className="h-14 w-14 items-center justify-center text-center font-bold "
                    onClick={() => setDeleteMode((prev) => !prev)}
                  >
                    {deleteMode ? (
                      <MdDelete className="h-12 w-12 p-2" />
                    ) : (
                      <MdOutlineArrowUpward className="h-12 w-12 p-2" />
                    )}
                  </Button>
                </Tooltip>
              </div>
              <h1 className="col-start-2 flex items-center justify-center text-center text-3xl font-bold text-white">
                House Property Sales
                <br />
                Time Series
                <MyInformModal
                  title="House Property Sales Time Series"
                  size="xl"
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-lg">
                      The{" "}
                      <a
                        href="https://www.kaggle.com/datasets/htagholdings/property-sales/"
                        target="_blank"
                        className="font-bold text-blue-500 underline hover:text-blue-700"
                      >
                        House Property Sales Time Series
                      </a>{" "}
                      accumulated property sales data for the{" "}
                      <strong>2007-2019 period for one specific region.</strong>{" "}
                      The data contains sales prices for houses and units with
                      1~5 bedrooms.
                    </p>
                  </div>
                </MyInformModal>
              </h1>
              <div className="col-start-3 flex flex-grow justify-end pr-6">
                <h1
                  className="cursor-pointer text-center text-2xl font-bold text-white/80 hover:text-white"
                  onClick={() =>
                    setOpenModal(
                      openModal === "dismissible" ? undefined : "dismissible",
                    )
                  }
                >
                  How To Use ?
                </h1>
              </div>
            </div>
            <MyStream
              ref={restartRef}
              data={data}
              aggregateBy={aggregateBy}
              deleteMode={deleteMode}
            />
          </div>
        )}
      </CheckBeforeRender>
      <MyModal
        title="How To Use ?"
        openModal={openModal}
        setOpenModal={setOpenModal}
        size="5xl"
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          <img
            src="https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/howToUseStream.png"
            alt="how to use"
            width={1920}
            height={1080}
          />
        </div>
      </MyModal>

      <footer className="fixed bottom-0 right-0 m-2">
        <p>Built by 312552021</p>
      </footer>
    </div>
  );
}

export default App;
