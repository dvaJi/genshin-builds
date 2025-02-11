"use client";

import { Fragment, useState } from "react";

import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import type { Ascension } from "@interfaces/genshin";

type Props = {
  ascensions: Ascension[];
};

function CharacterStats({ ascensions }: Props) {
  const [selected, setSelected] = useState(ascensions[0]);
  const { t } = useIntl("character");

  return (
    <>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {ascensions.map((ascension) => (
          <Button
            key={ascension.level.join()}
            onClick={() => setSelected(ascension)}
            variant={
              ascension.level.join() === selected.level.join()
                ? "primary"
                : "secondary"
            }
          >
            {t({
              id: "lv.",
              defaultMessage: "Lv.",
            })}
            {ascension.level.join(" - ")}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 rounded">
        <div className="bg-muted py-2"></div>
        <div className="bg-muted py-2">
          {t({
            id: "before_ascension",
            defaultMessage: "Before Ascension",
          })}
        </div>
        <div className="bg-muted py-2">
          {t({
            id: "after_ascension",
            defaultMessage: "After Ascension",
          })}
        </div>
        {selected.stats.map((stat) => (
          <Fragment key={stat.label}>
            <div className="border-muted border-b px-2 py-1">{stat.label}</div>
            <div className="border-muted border-b py-1">
              {stat.values ? stat.values[0] : "-"}
            </div>
            <div className="border-muted border-b py-1">
              {stat.values ? stat.values[1] : "-"}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default CharacterStats;
