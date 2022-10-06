import { useMemo, useState } from "react";
import clsx from "clsx";

import useIntl from "@hooks/use-intl";
import { usePopover } from "@hooks/use-popover";
import { getUrl } from "@lib/imgUrl";

import Button from "../ui/Button";
import Input from "../ui/Input";
import SimpleRarityBox from "../SimpleRarityBox";

type PopoverProps = {
  id: string;
  data: number;
  originalData: number;
  materialInfo: Record<string, any>;
  handleOnChange: (value: { id: string; value: number }) => void;
};

function ItemPopover({
  id,
  data,
  originalData,
  materialInfo,
  handleOnChange,
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

  const onChange = (value: number) => {
    setInventory(value);
  };

  return (
    <div className="cursor-pointer" {...trigger}>
      <SimpleRarityBox
        img={getUrl(`/${materialInfo?.type}/${id}.png`, 45, 45)}
        rarity={materialInfo?.rarity}
        name={numFormat.format(data)}
        alt={materialInfo?.name}
        nameSeparateBlock
        className={clsx("w-11 h-11", { grayscale: data === 0 })}
        classNameBlock="w-11"
      />
      {open && (
        <div
          {...content}
          className="bg-vulcan-800 border-2 border-vulcan-800 rounded shadow-2xl z-1000"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-vulcan-600 p-1 rounded-t text-sm text-white">
            {materialInfo?.name}
          </div>
          <div className="px-2">
            {t({
              id: "remaining",
              defaultMessage: "Remaining",
            })}
            : {remaining}
          </div>
          <div className="px-2">
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
                handleOnChange({ id, value: remaining });
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

export default ItemPopover;
