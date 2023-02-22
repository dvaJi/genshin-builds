import clsx from "clsx";
import { memo } from "react";

interface Props {
  title?: string;
  currentValue: number;
  values: number[];
  setValue: (value: number) => void;
}

const Crement = ({ title, currentValue, values, setValue }: Props) => {
  const currentIndex = values.indexOf(currentValue);
  return (
    <div className="mr-2 flex flex-col items-center">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex items-center">
        <button
          className={clsx(
            currentValue <= values[0] ? "text-gray-700" : "hover:text-white"
          )}
          disabled={currentValue <= values[0]}
          onClick={() => setValue(values[currentIndex - 1])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <p className="mx-2 text-lg font-bold text-white">{currentValue}</p>
        <button
          className={clsx(
            currentValue >= values[values.length - 1]
              ? "text-gray-700"
              : "hover:text-white"
          )}
          onClick={() => setValue(values[currentIndex + 1])}
          disabled={currentValue >= values[values.length - 1]}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(Crement);
