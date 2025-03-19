"use client";

import clsx from "clsx";
import { memo } from "react";

import ElementIcon from "@components/genshin/ElementIcon";
import { useStore } from "@nanostores/react";

import { $filters } from "./state";

type Props = {
  elements: { label: string; value: string }[];
};

function ElementsFilter({ elements }: Props) {
  const ad = useStore($filters);
  return (
    <div className="flex h-full flex-wrap items-center justify-center gap-4">
      {elements.map((element) => (
        <button
          key={element.value}
          onClick={() =>
            $filters.set({
              ...ad,
              elements: ad.elements.includes(element.value)
                ? ad.elements.filter((el) => el !== element.value)
                : [...ad.elements, element.value],
            })
          }
          className={clsx({
            "saturate-0":
              ad.elements.length > 0 && !ad.elements.includes(element.value),
          })}
        >
          <ElementIcon type={element.label} height={45} width={45} />
        </button>
      ))}
    </div>
  );
}

export default memo(ElementsFilter);
