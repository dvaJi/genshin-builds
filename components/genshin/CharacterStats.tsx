"use client";

import { useTranslations } from "next-intl";
import { Fragment, memo, useState } from "react";

import Button from "@components/ui/Button";
import type { Ascension } from "@interfaces/genshin";

type Props = {
  ascensions: Ascension[];
};

function CharacterStats({ ascensions }: Props) {
  const [selected, setSelected] = useState(ascensions[0]);
  const t = useTranslations("Genshin.character");

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
            {t("lv")}
            {ascension.level.join(" - ")}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-3 rounded">
        <div className="bg-muted py-2"></div>
        <div className="bg-muted py-2">{t("before_ascension")}</div>
        <div className="bg-muted py-2">{t("after_ascension")}</div>
        {selected.stats.map((stat) => (
          <Fragment key={stat.label}>
            <div className="border-b border-muted px-2 py-1">{stat.label}</div>
            <div className="border-b border-muted py-1">
              {stat.values ? stat.values[0] : "-"}
            </div>
            <div className="border-b border-muted py-1">
              {stat.values ? stat.values[1] : "-"}
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default memo(CharacterStats);
