import { useMemo, useState } from "react";
import clsx from "clsx";

import useIntl from "@hooks/use-intl";
import { usePopover } from "@hooks/use-popover";
import { getUrl } from "@lib/imgUrl";

import Button from "./Button";
import Input from "./Input";
import SimpleRarityBox from "./SimpleRarityBox";

type PopoverProps = {
  id: string;
  idsByResource: any[];
  data: number;
  originalData: number;
  materialInfo: Record<string, any>;
  handleOnChange: (value: {
    id: string;
    value: number;
    idsByResource: any[];
    remainingById: number[];
  }) => void;
};

function ItemPopoverSummary({
  id,
  idsByResource,
  data,
  originalData,
  handleOnChange,
  materialInfo,
}: PopoverProps) {
  const [inventory, setInventory] = useState(originalData - data);
  const [open, trigger, content] = usePopover<HTMLDivElement, HTMLDivElement>(
    false
  );
  const { t } = useIntl();
  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });

  const remaining = useMemo(() => {
    return originalData - inventory;
  }, [inventory, originalData]);

  const remainingById = useMemo(() => {
    let remainingInventory = inventory;
    const hasDone = idsByResource
      .sort((d1: any, d2: any) => {
        return d1[1] === d1[2] ? -1 : d1[2] - d2[2];
      })
      .filter((data: any) => data[1] > 0);
    return idsByResource.map((data: any) => {
      if (remainingInventory < 0) {
        return data[2];
      }

      let alreadyUsedResources = 0;

      const hasDoneResource = hasDone.find((dd: any) => dd[0] === data[0]);
      if (hasDoneResource) {
        alreadyUsedResources = hasDoneResource[1];
      }

      const result = data[2] - remainingInventory - alreadyUsedResources;
      remainingInventory = remainingInventory - data[2];

      if (result < 0) {
        return 0;
      }

      return result;
    });
  }, [idsByResource, inventory]);

  const onChange = (value: number) => {
    setInventory(value);
  };

  return (
    <div className="cursor-pointer" {...trigger}>
      <SimpleRarityBox
        img={getUrl(`/${materialInfo.type}/${id}.png`, 45, 45)}
        rarity={materialInfo.rarity}
        name={numFormat.format(data as any)}
        alt={materialInfo.name}
        nameSeparateBlock
        className={clsx("w-12 h-12", { grayscale: data === 0 })}
        classNameBlock="w-12"
      />
      {open && (
        <div
          {...content}
          className="bg-vulcan-800 border-2 border-vulcan-800 rounded shadow-2xl z-1000"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-vulcan-600 p-1 rounded-t text-sm text-white">
            {materialInfo.name}
          </div>

          <div className="p-2 text-sm">
            <span>
              {t({
                id: "priority",
                defaultMessage: "Priority",
              })}
              :
            </span>
            <div className="text-xs">
              {idsByResource.map((data, i) => (
                <span
                  className={clsx("block", {
                    "line-through": remainingById[i] === 0,
                  })}
                  key={id + i}
                >
                  {i + 1} - {data[0]} - {remainingById[i]}
                </span>
              ))}
            </div>
          </div>
          <div className="px-2 text-sm">
            {t({
              id: "total_remaining",
              defaultMessage: "Total remaining",
            })}
            : {remaining}
          </div>
          <div className="px-2 text-sm">
            {t({
              id: "inventory",
              defaultMessage: "Inventory",
            })}
            : {inventory}
          </div>
          <div className="p-2 flex items-center content-around">
            <button
              disabled={remaining === originalData}
              className="text-white w-7 border-2 border-white border-opacity-10 rounded px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600"
              onClick={() => onChange(inventory - 1)}
            >
              -
            </button>
            <Input
              type="number"
              className="w-24"
              value={inventory}
              onChange={(e) => onChange(Number(e.target.value))}
              min={0}
              max={originalData}
            />
            <button
              disabled={remaining === 0}
              className="text-white w-7 border-2 border-white border-opacity-10 rounded px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600"
              onClick={() => onChange(inventory + 1)}
            >
              +
            </button>
          </div>
          <div className="flex justify-center">
            <Button
              className="py-1 mb-2"
              onClick={() => {
                handleOnChange({
                  id,
                  value: data - inventory,
                  idsByResource,
                  remainingById,
                });
                // close the popover
                trigger.onClick();
              }}
            >
              {t({
                id: "save_and_close",
                defaultMessage: "Save and close",
              })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemPopoverSummary;
