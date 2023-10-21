// import { useState } from "react";
import { ReactNode, useState } from "react";
import "./App.css";
import { UniversityRankingFetcher } from "./utils/dataHandler";
import useSWR from "swr";

import MyBar from "./components/MyBar";
import { MyInformModal } from "./components/MyInformModal";

import { BsSortDownAlt, BsSortDown } from "react-icons/bs";
import { Button, Tooltip } from "flowbite-react";
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
    "https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/TIMES_WorldUniversityRankings_2024.csv",
    UniversityRankingFetcher,
  );

  const [sortingOrder, setSortingOrder] = useState("asc");
  const [openModal, setOpenModal] = useState<string | undefined>(undefined);

  console.log(data && data);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-100">
      <CheckBeforeRender isLoading={isLoading} error={error}>
        {data && (
          <div className="h-[50rem] w-[90rem] flex-col place-items-center space-y-2 pb-20">
            <div className="grid w-full grid-cols-3 items-center justify-center rounded-xl bg-slate-700 p-4">
              <div className="col-start-1 flex flex-grow items-center justify-start space-x-2 pl-6">
                <Tooltip
                  style="light"
                  content="Click to change sorting order"
                  arrow={false}
                  className="text-xl"
                >
                  <Button
                    // gradientDuoTone="cyanToBlue"
                    color="gray"
                    className="h-14 w-14 items-center justify-center "
                    onClick={() =>
                      setSortingOrder(
                        sortingOrder === "Ascend" ? "Descend" : "Ascend",
                      )
                    }
                  >
                    {sortingOrder === "Ascend" ? (
                      <BsSortDownAlt className="h-12 w-12 p-2" />
                    ) : (
                      <BsSortDown className="h-12 w-12 p-2" />
                    )}
                  </Button>
                </Tooltip>
              </div>
              <h1 className="col-start-2 flex items-center justify-center text-center text-3xl font-bold text-white">
                World University Rankings
                <MyInformModal title="World University Rankings">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-center text-lg">
                      The{" "}
                      <a
                        href="https://www.timeshighereducation.com/world-university-rankings/2022/world-ranking#!/page/0/length/25/sort_by/rank/sort_order/asc/cols/stats"
                        target="_blank"
                        className="font-bold text-blue-500 underline hover:text-blue-700"
                      >
                        Times Higher Education World University Rankings
                      </a>{" "}
                      use 13 carefully calibrated performance indicators to
                      provide the most comprehensive and balanced comparisons,
                      trusted by students, academics, university leaders,
                      industry and governments.
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
            <MyBar data={data} sortOrder={sortingOrder} />
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
            src="https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/howToUse.png"
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
