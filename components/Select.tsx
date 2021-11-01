import clsx from "clsx";
import { Character } from "genshin-data";
import { useMemo, useRef, useState } from "react";

import { getUrl } from "@lib/imgUrl";

type SelectProps = {
  options: Character[];
  placeholder?: string;
  className?: string;
  onChange: (character: Character) => void;
};

const Select = ({ options, className, onChange, ...props }: SelectProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState<Character>(options[0]);
  const [filter, setFilter] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCharacter = useMemo<Character[]>(() => {
    return options.filter((op) =>
      op.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, options]);

  const placeholder = props.placeholder || "Select";

  return (
    <div className="select-none relative">
      <div
        className={`flex w-full relative items-center px-4 bg-vulcan-900 rounded-2xl h-12 focus-within:outline-none focus-within:border-vulcan-500 border-2 border-transparent ease-in duration-100 ${className}`}
      >
        {selected && (
          <img
            className="w-6 h-6 mr-2"
            src={getUrl(
              `/characters/${selected.id}/${selected.id}_portrait.png`,
              32,
              32
            )}
            alt={selected.name}
          />
        )}
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
        {filteredCharacter.length ? (
          <div className="h-64 overflow-x-auto">
            {filteredCharacter.map((character) => (
              <span
                key={character.id}
                onClick={() => {
                  setSelected(character);
                  onChange(character);
                  setFilter("");
                }}
                className={clsx(
                  "p-3 rounded-md cursor-pointer flex mr-2 hover:bg-vulcan-600",
                  {
                    "bg-vulcan-500": selected === character,
                  }
                )}
              >
                <img
                  className="w-6 h-6 mr-3"
                  src={getUrl(
                    `/characters/${character.id}/${character.id}_portrait.png`,
                    32,
                    32
                  )}
                  alt={character.name}
                />
                <span className="flex-1 text-base">{character.name}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="p-3 rounded-xl cursor-pointer flex mr-2 my-2">
            Character not found
          </span>
        )}
      </div>
    </div>
  );
};

export default Select;
