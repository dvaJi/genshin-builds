import clsx from "clsx";
import { memo } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";

interface Props {
  title: string;
  currentValue: number;
  values: number[];
  setValue: (value: number) => void;
}

const Crement = ({ title, currentValue, values, setValue }: Props) => {
  const currentIndex = values.indexOf(currentValue);
  return (
    <div className="flex flex-col items-center mr-2">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center">
        <button
          className={clsx(
            currentValue <= values[0] ? "text-gray-700" : "hover:text-white"
          )}
          disabled={currentValue <= values[0]}
          onClick={() => setValue(values[currentIndex - 1])}
        >
          <AiOutlineMinusCircle />
        </button>
        <p className="text-lg font-bold text-white mx-2">{currentValue}</p>
        <button
          className={clsx(
            currentValue >= values[values.length - 1]
              ? "text-gray-700"
              : "hover:text-white"
          )}
          onClick={() => setValue(values[currentIndex + 1])}
          disabled={currentValue >= values[values.length - 1]}
        >
          <AiOutlinePlusCircle />
        </button>
      </div>
    </div>
  );
};
export default memo(Crement);
