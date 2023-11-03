import type { Dispatch, SetStateAction } from "react";
import React from "react";
import MyInformModal from "./MyInformModal";

interface IProps {
  legend: string;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min: number;
  max: number;
  step: number;
  disable: boolean;
}

const precision = 100;

const MySlider: React.FC<IProps> = ({
  legend,
  value,
  setValue,
  min = 0,
  max = 100,
  step = 1,
  disable,
}) => {
  return (
    <div className=" flex flex-col justify-center px-20 pb-12">
      <span className="flex gap-2 text-lg font-bold">
        <h3 className="h-min text-xl font-bold">{legend}</h3>
        <MyInformModal title="About" size="3xl">
          {/* Introduce what is the Abalone Dataset About, additional inf is in https://archive.ics.uci.edu/dataset/1/abalone */}
          <p className="text-lg">
            Use the Ranking Window Slider to scroll through different sets of 20
            indexes.
            <br />
            <br />
            Simply drag the slider handle left or right to seamlessly view
            additional schools. This ensures a clear and focused view on a
            manageable number of rankings at once, enhancing your analysis
            experience.
          </p>
        </MyInformModal>
      </span>
      <input
        type="range"
        min={min * precision}
        step={step * precision}
        max={max * precision}
        list="tickmarks"
        value={(value * precision).toString()}
        className=" w-full accent-slate-500"
        onChange={(e) => setValue(parseInt(e.target.value) / precision)}
        disabled={disable}
      />
    </div>
  );
};

export default MySlider;
