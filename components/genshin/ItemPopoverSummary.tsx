"use client";

import clsx from "clsx";
import { memo, useCallback, useMemo, useState } from "react";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@app/components/ui/popover";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

import SimpleRarityBox from "../SimpleRarityBox";
import Button from "../ui/Button";
import Input from "../ui/Input";

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

// Helper function to check deep equality of idsByResource arrays
const areIdsByResourceEqual = (prevIds: any[], nextIds: any[]): boolean => {
  if (prevIds.length !== nextIds.length) return false;

  for (let i = 0; i < prevIds.length; i++) {
    const prev = prevIds[i];
    const next = nextIds[i];

    if (prev.length !== next.length) return false;

    for (let j = 0; j < prev.length; j++) {
      if (prev[j] !== next[j]) return false;
    }
  }

  return true;
};

function ItemPopoverSummaryComponent({
  id,
  idsByResource,
  data,
  originalData,
  handleOnChange,
  materialInfo,
}: PopoverProps) {
  const [inventory, setInventory] = useState(originalData - data);
  const [open, setOpen] = useState(false);
  const { t } = useIntl("todo");
  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });

  // Memoize the remaining calculation
  const remaining = useMemo(() => {
    return originalData - inventory;
  }, [inventory, originalData]);

  // Memoize the sorted idsByResource for better performance
  const sortedIdsByResource = useMemo(() => {
    return idsByResource.slice().sort((d1: any, d2: any) => {
      return d1[1] === d1[2] ? -1 : d1[2] - d2[2];
    });
  }, [idsByResource]);

  // Calculate hasDone only once
  const hasDone = useMemo(() => {
    return sortedIdsByResource.filter((data: any) => data[1] > 0);
  }, [sortedIdsByResource]);

  // Optimize the remainingById calculation
  const remainingById = useMemo(() => {
    let remainingInventory = inventory;

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
  }, [idsByResource, inventory, hasDone]);

  const onChange = useCallback(
    (value: number) => {
      // Constrain value between 0 and originalData
      const newValue = Math.max(0, Math.min(originalData, value));
      setInventory(newValue);
    },
    [originalData],
  );

  // Memoize the handleSave function
  const handleSave = useCallback(() => {
    handleOnChange({
      id,
      value: data - inventory,
      idsByResource,
      remainingById,
    });
    setOpen(false);
  }, [handleOnChange, id, data, inventory, idsByResource, remainingById]);

  // Calculate progress percentage for the visual indicator
  const progressPercentage = useMemo(() => {
    return originalData === 0
      ? 100
      : Math.floor(((originalData - remaining) / originalData) * 100);
  }, [originalData, remaining]);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <SimpleRarityBox
            img={getUrl(`/materials/${id}.png`, 45, 45)}
            rarity={materialInfo?.rarity}
            name={numFormat.format(data as any)}
            alt={materialInfo?.name}
            nameSeparateBlock
            className={clsx(
              "h-12 w-12 transition-all duration-200 hover:scale-105",
              { "opacity-60 grayscale": data === 0 },
            )}
            classNameBlock="w-12"
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
              <span className="text-muted-foreground">
                {t({ id: "progress", defaultMessage: "Progress" })}
              </span>
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
                {t({
                  id: "total_remaining",
                  defaultMessage: "Total remaining",
                })}
              </div>
              <div className="font-medium">{remaining}</div>
            </div>
            <div className="rounded-md bg-muted/40 px-3 py-2">
              <div className="text-xs text-muted-foreground">
                {t({ id: "inventory", defaultMessage: "Inventory" })}
              </div>
              <div className="font-medium">{inventory}</div>
            </div>
          </div>

          {idsByResource.length > 0 && (
            <div className="rounded-md bg-muted/40 p-3">
              <div className="mb-2 text-sm font-medium">
                {t({ id: "priority", defaultMessage: "Priority" })}
              </div>
              <div className="custom-scroll max-h-32 space-y-1.5 overflow-y-auto pr-1">
                {idsByResource.map((data, i) => (
                  <div
                    key={id + i}
                    className={clsx(
                      "flex items-center justify-between rounded px-2 py-1 text-xs",
                      remainingById[i] === 0
                        ? "bg-muted/20 text-muted-foreground"
                        : "bg-secondary/40",
                    )}
                  >
                    <div className="flex items-center">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted/80 text-xs">
                        {i + 1}
                      </span>
                      <span
                        className={clsx({
                          "line-through": remainingById[i] === 0,
                        })}
                      >
                        {data[0]}
                      </span>
                    </div>
                    <span className="font-medium">{remainingById[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            {t({ id: "save_and_close", defaultMessage: "Save and close" })}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Use React.memo with a custom equality function to prevent unnecessary re-renders
const ItemPopoverSummary = memo(
  ItemPopoverSummaryComponent,
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.id === nextProps.id &&
      prevProps.data === nextProps.data &&
      prevProps.originalData === nextProps.originalData &&
      prevProps.handleOnChange === nextProps.handleOnChange &&
      areIdsByResourceEqual(prevProps.idsByResource, nextProps.idsByResource)
    );
  },
);

export default ItemPopoverSummary;
