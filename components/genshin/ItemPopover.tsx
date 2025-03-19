"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { memo, useCallback, useMemo, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover";
import { getUrl } from "@lib/imgUrl";

import SimpleRarityBox from "../SimpleRarityBox";
import Button from "../ui/Button";
import Input from "../ui/Input";

type PopoverProps = {
  id: string;
  data: number;
  originalData: number;
  materialInfo: Record<string, any>;
  handleOnChange: (value: { id: string; value: number }) => void;
};

function ItemPopoverComponent({
  id,
  data,
  originalData,
  materialInfo,
  handleOnChange,
}: PopoverProps) {
  const [inventory, setInventory] = useState(originalData - data);
  const [open, setOpen] = useState(false);
  const t = useTranslations("Genshin.todo");
  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });

  // Memoize the remaining calculation
  const remaining = useMemo(() => {
    return originalData - inventory;
  }, [inventory, originalData]);

  // Memoize the onChange handler
  const onChange = useCallback(
    (value: number) => {
      // Constrain value between 0 and originalData
      const newValue = Math.max(0, Math.min(originalData, value));
      setInventory(newValue);
    },
    [originalData],
  );

  // Memoize handle increment/decrement
  const handleDecrement = useCallback(
    () => onChange(inventory - 1),
    [onChange, inventory],
  );
  const handleIncrement = useCallback(
    () => onChange(inventory + 1),
    [onChange, inventory],
  );

  // Memoize input handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  // Memoize the save handler
  const handleSave = useCallback(() => {
    handleOnChange({ id, value: remaining });
    setOpen(false);
  }, [handleOnChange, id, remaining]);

  // Calculate progress percentage for the visual indicator
  const progressPercentage = useMemo(() => {
    return originalData === 0
      ? 100
      : Math.floor(((originalData - remaining) / originalData) * 100);
  }, [originalData, remaining]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <SimpleRarityBox
            img={getUrl(`/materials/${id}.png`, 45, 45)}
            rarity={materialInfo?.rarity}
            name={numFormat.format(data)}
            alt={materialInfo?.name}
            nameSeparateBlock
            className={clsx(
              "h-11 w-11 transition-all duration-200 hover:scale-105",
              { "opacity-60 grayscale": data === 0 },
            )}
            classNameBlock="w-11"
          />
          {data === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/80">
                <IoClose className="h-3 w-3 text-accent-foreground" />
              </div>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="z-[1000] w-64 rounded-lg border border-border bg-card p-0 shadow-lg">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center space-x-3">
            <div
              className={clsx(
                "h-10 w-10 overflow-hidden rounded",
                `genshin-bg-rarity-${materialInfo?.rarity || 3}`,
              )}
            >
              <img
                src={getUrl(`/materials/${id}.png`, 40, 40)}
                alt={materialInfo?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              {materialInfo?.name}
            </h3>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("progress")}</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-0 bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-muted/40 px-3 py-2">
              <div className="text-xs text-muted-foreground">
                {t("remaining")}
              </div>
              <div className="font-medium">{remaining}</div>
            </div>
            <div className="rounded-md bg-muted/40 px-3 py-2">
              <div className="text-xs text-muted-foreground">
                {t("inventory")}
              </div>
              <div className="font-medium">{inventory}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={remaining === originalData}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              onClick={handleDecrement}
              aria-label="Decrease"
            >
              <HiMinus className="h-4 w-4" />
            </button>

            <Input
              type="number"
              className="h-8 flex-1 text-center"
              value={inventory}
              onChange={handleInputChange}
              min={0}
              max={originalData}
            />

            <button
              disabled={remaining === 0}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
              onClick={handleIncrement}
              aria-label="Increase"
            >
              <HiPlus className="h-4 w-4" />
            </button>
          </div>

          <Button className="w-full justify-center" onClick={handleSave}>
            {t("save_and_close")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Use React.memo with a custom equality function to prevent unnecessary re-renders
const ItemPopover = memo(ItemPopoverComponent, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.data === nextProps.data &&
    prevProps.originalData === nextProps.originalData &&
    prevProps.handleOnChange === nextProps.handleOnChange
  );
});

export default ItemPopover;
