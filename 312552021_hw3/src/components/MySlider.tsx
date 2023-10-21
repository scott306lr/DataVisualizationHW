import type { Dispatch, SetStateAction } from "react";
import React from "react";
import MyModal from "./MyModal";

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
    <div className=" flex h-full flex-col justify-center px-24">
      <span className="flex gap-2 text-lg font-bold">
        <h3 className="h-min text-xl font-bold">{legend}</h3>
        <MyModal title="About">
          {/* Introduce what is the Abalone Dataset About, additional inf is in https://archive.ics.uci.edu/dataset/1/abalone */}
          <p className="text-lg">
            You can adjust the color threshold by simply dragging the slider.
            <br />
            <br />
            Utilizing this feature, you can readily discern the visual
            distinctions and similarities among the three abalone types.
          </p>
        </MyModal>
      </span>
      <input
        type="range"
        min={min * precision}
        step={step * precision}
        max={max * precision}
        list="tickmarks"
        value={(value * precision).toString()}
        className=" w-full accent-red-500"
        onChange={(e) => setValue(parseInt(e.target.value) / precision)}
        disabled={disable}
      />
    </div>
  );
};

export default MySlider;
