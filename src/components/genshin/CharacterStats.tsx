import { Fragment, useState } from "react";
import type { Ascension } from "genshin-data/dist/types/character";

type Props = {
  ascensions: Ascension[];
  dict: Record<string, string>;
};

function CharacterStats({ ascensions, dict }: Props) {
  const [selected, setSelected] = useState(ascensions[0]);

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-center">
        {ascensions.map((ascension) => (
          <div
            key={ascension.level.join()}
            onClick={() => setSelected(ascension)}
            className="mr-2 my-1 cursor-pointer rounded bg-vulcan-700 px-3 py-2 hover:bg-vulcan-600 data-[selected=true]:bg-vulcan-600 data-[selected=true]:text-white"
            data-selected={ascension.level.join() === selected.level.join()}
          >
            {dict["lv."]}
            {ascension.level.join(" - ")}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 rounded bg-vulcan-900">
        <div className="bg-vulcan-700 py-2"></div>
        <div className="bg-vulcan-700 py-2">{dict["before_ascension"]}</div>
        <div className="bg-vulcan-700 py-2">{dict["after_ascension"]}</div>
        {selected.stats.map((stat) => (
          <Fragment key={stat.label}>
            <div className="border-b border-vulcan-700 py-1 px-2">
              {stat.label}
            </div>
            <div className="border-b border-vulcan-700 py-1">
              {stat.values[0]}
            </div>
            <div className="border-b border-vulcan-700 py-1">
              {stat.values[1]}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default CharacterStats;
