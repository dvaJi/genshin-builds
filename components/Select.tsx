import clsx from "clsx";
import { useMemo, useRef, useState } from "react";

type Option = {
  name: string;
  [props: string]: string;
};

type SelectProps = {
  options: Option[];
  placeholder?: string;
  clearOnSelect?: boolean;
  onChange: (value: Option) => void;
  itemsListRender: (option: Option) => React.ReactNode;
  selectedIconRender?: (option: Option) => React.ReactNode;
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
    <div className="relative select-none">
      <div className="relative flex h-12 w-full items-center rounded-2xl border-2 border-transparent bg-vulcan-900 px-4 duration-100 ease-in focus-within:border-vulcan-500 focus-within:outline-none">
        {selected && selectedIconRender && selectedIconRender(selected)}
        <input
          ref={inputRef}
          className="h-full w-full border-0 bg-transparent focus:outline-none"
          placeholder={placeholder}
          value={
            props.clearOnSelect ? filter : isFocused ? filter : selected?.name
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div
        className={clsx(
          "options absolute z-50 flex min-h-full w-full flex-col rounded-lg border border-gray-900 bg-vulcan-700 pl-2 text-white shadow-lg",
          isFocused ? "" : "hidden"
        )}
      >
        {filteredOptions.length ? (
          <div className="h-64 overflow-x-auto">
            {filteredOptions.map((option) => (
              <span
                key={option.name}
                onClick={() => {
                  setSelected(option);
                  onChange(option);
                  setFilter("");

                  if (props.clearOnSelect) {
                    setSelected(options[0]);
                  }
                }}
                className={clsx(
                  "mr-2 flex cursor-pointer rounded-md p-3 hover:bg-vulcan-600",
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
          <span className="my-2 mr-2 flex cursor-pointer rounded-xl p-3">
            No results
          </span>
        )}
      </div>
    </div>
  );
};

export default Select;
