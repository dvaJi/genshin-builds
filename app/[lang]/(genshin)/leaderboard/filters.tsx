import { useState } from "react";

import Select from "@components/Select";
import Button from "@components/ui/Button";
import { Character } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";

type Filters = {
  characters: string[];
};

type Props = {
  characters: Character[];
  onApplyFilters: (filters: Filters) => void;
};

export default function Filters({ characters, onApplyFilters }: Props) {
  const [characterFilter, setCharacterFilter] = useState<string[]>([]);

  const updateCharactersFilter = (optionId: string) => {
    /// Check if the option is already selected
    const index = characterFilter.indexOf(optionId);
    if (index === -1) {
      setCharacterFilter((prev) => [...prev, optionId]);
    }

    /// Remove the option from the filter
    if (index !== -1) {
      setCharacterFilter((prev) => prev.filter((id) => id !== optionId));
    }
  };

  function handleApplyFilters() {
    onApplyFilters({
      characters: characterFilter.map((id) => {
        const ch = characters.find((c) => c.id === id);
        return ch?._id.toString() ?? "";
      }),
    });
  }

  return (
    <>
      <div className="flex gap-4">
        <Select
          clearOnSelect
          placeholder="Select characters"
          options={characters.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
          onChange={(option) => {
            updateCharactersFilter(option.id);
          }}
          itemsListRender={(option) => (
            <>
              <img
                className="mr-3 h-6 w-6"
                src={getUrl(`/characters/${option.id}/image.png`, 32, 32)}
                alt={option.name}
              />
              <span className="flex-1 text-base">{option.name}</span>
            </>
          )}
        />
        <div className="flex flex-wrap gap-2">
          {characterFilter.map((id) => {
            const ch = characters.find((c) => c.id === id);
            return (
              <button
                key={id}
                title="Remove filter"
                className="group flex items-center justify-center gap-2 rounded-xl bg-vulcan-700 p-1 px-2 hover:bg-vulcan-600"
                onClick={() => {
                  updateCharactersFilter(id);
                }}
              >
                <img
                  className="h-6 w-6 rounded-full"
                  src={getUrl(`/characters/${ch?.id}/image.png`, 32, 32)}
                  alt={ch?.name}
                />
                <span className="text-sm">{ch?.name}</span>
                <span className="text-slate-400 group-hover:text-slate-300">
                  x
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </>
  );
}
