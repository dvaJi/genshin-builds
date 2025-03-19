"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { MdHelpOutline } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import Button from "@components/ui/Button";
import { getUrl } from "@lib/imgUrl";

import { calculateFateCount } from "./actions";

const initialState = {
  message: "",
};

function SubmitButton({ text }: { text: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        text
      )}
    </Button>
  );
}

export function FateCountCalculatorForm() {
  const t = useTranslations("Genshin.calculator");
  const [state, formAction] = useActionState(calculateFateCount, initialState);
  const [formValues, setFormValues] = useState({
    intertwinedFate: 0,
    starglitter: 0,
    stardust: 0,
    primogem: 0,
    genesisCrystal: 0,
    welkinMoon: 0,
    daysUntilPull: 0,
    stardustLeft: 5,
  });

  const handleInputChange = (field: string, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const fateValues = [
    {
      id: "intertwinedFate",
      name: t("intertwinedFate"),
      image: getUrl("/intertwined_fate.webp", 32),
      tooltip: t("intertwinedFate_desc"),
    },
    {
      id: "starglitter",
      name: t("starglitter"),
      image: getUrl("/starglitter.png", 32),
      tooltip: t("starglitter_desc"),
    },
    {
      id: "stardust",
      name: t("stardust"),
      image: getUrl("/stardust.png", 32),
      tooltip: t("stardust_desc"),
    },
    {
      id: "primogem",
      name: t("primogem"),
      image: getUrl("/primogem.png", 32),
      tooltip: t("primogem_desc"),
    },
    {
      id: "genesisCrystal",
      name: t("genesis_crystal"),
      image: getUrl("/genesis_crystal.webp", 32),
      tooltip: t("genesis_crystal_desc"),
    },
    {
      id: "welkinMoon",
      name: t("welkin_moon_days"),
      image: getUrl("/welkin_moon.png", 32),
      tooltip: t("welkin_moon_desc"),
    },
  ];

  const parameters = [
    {
      id: "daysUntilPull",
      name: t("daysUntilPull"),
      tooltip: t("daysUntilPull_desc"),
    },
    {
      id: "stardustLeft",
      name: t("stardustLeft"),
      tooltip: t("stardustLeft_desc"),
      defaultValue: 5,
    },
  ];

  return (
    <div className="card">
      <form action={formAction}>
        {state?.message && (
          <div
            aria-live="polite"
            role="status"
            className="mb-4 rounded-md bg-red-500/20 p-3 text-center text-red-200"
          >
            {state.message}
          </div>
        )}

        <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:gap-8">
          <div className="relative flex min-w-[300px] max-w-md flex-col">
            <h3 className="mb-2 text-lg font-medium text-white">
              {t("your_resources")}
            </h3>
            {fateValues.map((value) => (
              <div
                key={value.id}
                className="mb-3 rounded-xl border border-vulcan-600 p-3 transition-all duration-150 hover:border-vulcan-400"
              >
                <div className="mb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={value.image}
                      alt={value.name}
                      className="mr-2 w-6"
                      width={24}
                      height={24}
                    />
                    <p className="text-white">{value.name}</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        aria-label={`Information about ${value.name}`}
                      >
                        <MdHelpOutline size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {value.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-full">
                    <input
                      id={value.id}
                      name={value.id}
                      className="mr-2 w-full rounded border-vulcan-600 bg-vulcan-900 p-2 text-center transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      type="number"
                      min="0"
                      value={formValues[value.id as keyof typeof formValues]}
                      onChange={(e) =>
                        handleInputChange(
                          value.id,
                          parseInt(e.target.value) || 0,
                        )
                      }
                      aria-label={value.name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex min-w-[300px] max-w-md flex-col">
            <h3 className="mb-2 text-lg font-medium text-white">
              {t("parameters")}
            </h3>
            {parameters.map((value) => (
              <div
                key={value.id}
                className="mb-3 rounded-xl border border-vulcan-600 p-3 transition-all duration-150 hover:border-vulcan-400"
              >
                <div className="mb-2 flex flex-row items-center justify-between">
                  <p className="text-white">{value.name}</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        aria-label={`Information about ${value.name}`}
                      >
                        <MdHelpOutline size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {value.tooltip}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-full">
                    <input
                      id={value.id}
                      name={value.id}
                      className="mr-2 w-full rounded border-vulcan-600 bg-vulcan-900 p-2 text-center transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      type="number"
                      min={0}
                      step={1}
                      pattern="\d*"
                      value={formValues[value.id as keyof typeof formValues]}
                      onChange={(e) =>
                        handleInputChange(
                          value.id,
                          parseInt(e.target.value) || 0,
                        )
                      }
                      aria-label={value.name}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <SubmitButton
                text={<span className="font-medium">{t("calculate")}</span>}
              />
            </div>
          </div>

          <div className="flex-grow">
            {state.result ? (
              <div>
                <div className="block h-full w-full overflow-hidden rounded-xl bg-vulcan-900 p-4 shadow-lg md:inline-block">
                  <h3 className="mb-4 text-center text-xl font-medium text-white">
                    {t("calculation_results")}
                  </h3>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="pr-2 text-left text-white">
                          {t("type")}
                        </th>
                        <th className="pr-2 text-center text-white">
                          {t("amount")}
                        </th>
                        <th className="pr-2 text-right text-white">
                          {t("total_primogems")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.result.data.map((res) => (
                        <tr key={res.name}>
                          <td className="border-t border-gray-700 py-2 pr-2 text-white">
                            <span className="inline-flex items-center">
                              {res.image !== null ? (
                                <img
                                  src={getUrl(res.image, 32)}
                                  alt={res.name}
                                  className="mr-2 h-6 w-6"
                                  width={24}
                                  height={24}
                                />
                              ) : null}
                              <p className="text-white">{res.name}</p>
                            </span>
                          </td>
                          <td className="border-t border-gray-700 py-2 pr-2 text-center text-white">
                            {res.amount}
                          </td>
                          <td className="border-t border-gray-700 py-2 text-right text-white">
                            {res.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          className="whitespace-nowrap border-t-2 border-gray-600 py-3 text-right font-medium text-white"
                          colSpan={3}
                        >
                          {t("total_primogems")}{" "}
                          <span className="text-xl font-bold">
                            {state.result.totalPrimogem}
                          </span>
                          <img
                            className="mx-1 inline w-6"
                            src={getUrl("/primogem.png", 32)}
                            alt="Primogem"
                            width={24}
                            height={24}
                          />
                          (
                          <span className="text-xl font-bold">
                            {Math.floor(state.result.totalPrimogem / 160)}
                          </span>
                          <img
                            className="mx-1 inline w-6"
                            src={getUrl("/intertwined_fate.webp", 32)}
                            alt="Fate"
                            width={24}
                            height={24}
                          />
                          )
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-lg border border-dashed border-vulcan-600 p-8 text-center">
                  <p className="text-gray-400">
                    {t("enter_values_and_calculate")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
