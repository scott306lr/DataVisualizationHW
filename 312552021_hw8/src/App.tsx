// import { useState } from "react";
import { ReactNode, Suspense, useState } from "react";
import "./App.css";
import { CarEvaluationFetcher } from "./utils/dataHandler";
import useSWR from "swr";

import MyModal from "./components/MyModal";
import MySankeyChart from "./components/MySankeyChart";
import DnDList from "./components/DNDList";

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

const Card = ({ item }: { item: string }) => {
  let bg_color = "white";
  if (item === "buying") bg_color = "#D3DCEC";
  if (item === "maint") bg_color = "#E4DBEF";
  if (item === "doors") bg_color = "#F7F0DB";
  if (item === "persons") bg_color = "#E8EEDB";
  if (item === "lug_boot") bg_color = "#E7C8EA";
  if (item === "safety") bg_color = "#ECCAC8";
  return (
    <div
      className="m-2 flex flex-col items-center justify-center rounded-xl border-2 border-gray-500 p-2"
      style={{ color: "black", backgroundColor: bg_color }}
    >
      <div className="text-xl">{item}</div>
    </div>
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
    "https://raw.githubusercontent.com/scott306lr/DataVisualizationHW/main/public/car.data",
    CarEvaluationFetcher,
  );

  const [keyOrder, setKeyOrder] = useState<string[]>([
    "buying",
    "maint",
    "doors",
    "persons",
    "lug_boot",
    "safety",
  ]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-100">
      <div className="invisible"></div>
      <CheckBeforeRender isLoading={isLoading} error={error}>
        {data && (
          <div className="h-[50rem] w-[100rem] flex-col place-items-center space-y-2 pb-32">
            <div className="grid w-full grid-cols-5 items-center rounded-xl bg-slate-700 p-4">
              <h1 className="col-start-1 flex items-center justify-center text-left text-3xl font-bold text-white">
                Car Evaluation
                <br />
                Dataset
              </h1>
              <div className="col-start-2 flex w-[38.6rem] flex-grow items-center justify-start space-x-2 ">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-gray-500 bg-gray-100 text-center font-bold">
                  <DnDList items={keyOrder} setItems={setKeyOrder}>
                    <Card item={""} />
                  </DnDList>
                </div>
                <h1 className="items-center justify-center whitespace-nowrap pl-2 text-left text-xl font-bold text-white">
                  Drag to
                  <br />
                  Reorder
                </h1>
              </div>
              <div className="col-start-5 flex flex-grow justify-end pr-6">
                <HowToUse title="How To Use ?" size="xl">
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <p className="text-left text-xl">
                      <span className="">
                        To dive deeper and customize your view...
                      </span>
                      <br />
                      <br />
                      <ul>
                        <li className="ml-4 list-disc">
                          Drag the blocks on the topbar to change the order of
                          the chart.
                        </li>
                        <li className="ml-4 list-disc">
                          Drag and rearrange the Sankey nodes to declutter the
                          view.
                        </li>
                      </ul>
                    </p>
                  </div>
                </HowToUse>
              </div>
            </div>
            <Suspense fallback={<div>Loading...</div>}>
              <MySankeyChart data={data} keyOrder={keyOrder} />
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
