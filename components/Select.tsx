import clsx from "clsx";
import { useMemo, useRef, useState } from "react";

type Option = {
  name: string;
  [props: string]: string;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
  onChange: (value: Option) => void;
  itemsListRender: (option: Option) => React.ReactNode;
  selectedIconRender: (option: Option) => React.ReactNode;
};

const Select = ({
  options,
  onChange,
  itemsListRender,
  selectedIconRender,
  ...props
}: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<Option>(options[0]);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo<Option[]>(() => {
    return options.filter((op) =>
      op.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, options]);

  const placeholder = props.placeholder || "Select";

  return (
    <div className="select-none relative">
      <div className="flex w-full relative items-center px-4 bg-vulcan-900 rounded-2xl h-12 focus-within:outline-none focus-within:border-vulcan-500 border-2 border-transparent ease-in duration-100">
        {selected && selectedIconRender(selected)}
        <input
          ref={inputRef}
          className="bg-transparent focus:outline-none border-0 h-full w-full"
          placeholder={placeholder}
          value={isFocused ? filter : selected?.name}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div
        className={clsx(
          "options bg-vulcan-700 rounded-lg absolute pl-2 w-full min-h-full z-50 flex flex-col text-white shadow-lg border border-gray-900",
          isFocused ? "" : "hidden"
        )}
      >
        {filteredOptions.length ? (
          <div className="h-64 overflow-x-auto">
            {filteredOptions.map((option) => (
              <span
                key={option.id}
                onClick={() => {
                  setSelected(option);
                  onChange(option);
                  setFilter("");
                }}
                className={clsx(
                  "p-3 rounded-md cursor-pointer flex mr-2 hover:bg-vulcan-600",
                  {
                    "bg-vulcan-500": selected === option,
                  }
                )}
              >
                {itemsListRender(option)}
                {/* <img
                  className="w-6 h-6 mr-3"
                  src={getUrl(
                    `/characters/${option.id}/${option.id}_portrait.png`,
                    32,
                    32
                  )}
                  alt={option.name}
                />
                <span className="flex-1 text-base">{option.name}</span> */}
              </span>
            ))}
          </div>
        ) : (
          <span className="p-3 rounded-xl cursor-pointer flex mr-2 my-2">
            No results
          </span>
        )}
      </div>
    </div>
  );
};

export default Select;
