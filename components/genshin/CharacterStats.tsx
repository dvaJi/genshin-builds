import { useState } from "react";
import { Ascension } from "genshin-data/dist/types/character";
import useIntl from "@hooks/use-intl";

type Props = {
  ascensions: Ascension[];
};

function CharacterStats({ ascensions }: Props) {
  const [selected, setSelected] = useState(ascensions[0]);
  const { t } = useIntl("character");

  return (
    <div className="p-4">
      <div className="flex">
        {ascensions.map((ascension) => (
          <div
            key={ascension.level.join()}
            onClick={() => setSelected(ascension)}
            className="mr-2 cursor-pointer rounded bg-vulcan-700 px-4 py-2 hover:bg-vulcan-600 data-[selected=true]:bg-vulcan-600 data-[selected=true]:text-white"
            data-selected={ascension.level.join() === selected.level.join()}
          >
            {t({
              id: "lv.",
              defaultMessage: "Lv.",
            })}
            {ascension.level.join(" - ")}
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 rounded bg-vulcan-900">
        <div className="bg-vulcan-700 py-2"></div>
        <div className="bg-vulcan-700 py-2">
          {t({
            id: "before_ascension",
            defaultMessage: "Before Ascension",
          })}
        </div>
        <div className="bg-vulcan-700 py-2">
          {t({
            id: "after_ascension",
            defaultMessage: "After Ascension",
          })}
        </div>
        {selected.stats.map((stat) => (
          <>
            <div className="border-b border-vulcan-700 py-1 px-2">
              {stat.label}
            </div>
            <div className="border-b border-vulcan-700 py-1">
              {stat.values[0]}
            </div>
            <div className="border-b border-vulcan-700 py-1">
              {stat.values[1]}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default CharacterStats;