"use client";

import dayjs from "dayjs";
import rTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import Button from "@components/ui/Button";
import { getUrl } from "@lib/imgUrl";

import { calculateResin } from "./actions";

dayjs.extend(rTime);

const CurrentTime = dynamic(() => import("@components/CurrentTime"), {
  ssr: false,
});

const initialState = {
  message: "",
};

function SubmitButton() {
  const t = useTranslations("Genshin.calculator");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="mr-2 animate-spin" />
          {t("calculating")}
        </div>
      ) : (
        t("calculate")
      )}
    </Button>
  );
}

export function ResinCalculatorForm() {
  const t = useTranslations("Genshin.calculator");
  const [type, setType] = useState("maxResin");
  const [currentResin, setCurrentResin] = useState(0);
  const [desiredResin, setDesiredResin] = useState(0);
  const [state, formAction] = useFormState(calculateResin, initialState);

  // Validation
  const MAX_RESIN = 160;
  const validCurrentResin = Math.min(Math.max(0, currentResin), MAX_RESIN);
  const validDesiredResin = Math.min(Math.max(0, desiredResin), MAX_RESIN);

  // Update inputs with validated values
  useEffect(() => {
    if (currentResin !== validCurrentResin) {
      setCurrentResin(validCurrentResin);
    }
    if (desiredResin !== validDesiredResin) {
      setDesiredResin(validDesiredResin);
    }
  }, [currentResin, desiredResin, validCurrentResin, validDesiredResin]);

  const handleCurrentResinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentResin(parseInt(e.target.value) || 0);
    setType("maxResin");
  };

  const handleDesiredResinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesiredResin(parseInt(e.target.value) || 0);
    setType("desiredResin");
  };

  // Calculate time automatically when inputs change
  const getEstimatedTime = () => {
    if (type === "maxResin") {
      const minutePerResin = 8;
      const missingResin = MAX_RESIN - validCurrentResin;
      const minutes = minutePerResin * missingResin;
      return dayjs().add(minutes, "minute").format("HH:mm");
    } else if (validDesiredResin > 0) {
      const minutePerResin = 8;
      const minutes = minutePerResin * validDesiredResin;
      return dayjs().add(minutes, "minute").format("HH:mm");
    }
    return null;
  };

  const estimatedTime = getEstimatedTime();
  const resinPercent = Math.round(
    (validCurrentResin / MAX_RESIN) * 100,
  ).toString();

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
        <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:gap-8">
          <div className="relative flex min-w-[300px] flex-col">
            <input type="hidden" name="type" value={type} />

            {/* Current Resin Section */}
            <div className="mb-6 rounded-lg border border-vulcan-600 p-4 transition hover:border-vulcan-500">
              <label
                htmlFor="currentResin"
                className="mb-2 block text-lg font-medium text-white"
              >
                {t("current_resin")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <img
                    src={getUrl("/resin.webp", 24)}
                    alt="Original Resin"
                    className="h-5 w-5"
                  />
                </span>
                <input
                  type="number"
                  value={validCurrentResin}
                  min={0}
                  max={160}
                  placeholder={t("current_resin")}
                  className={`w-full rounded-md border ${
                    type === "maxResin"
                      ? "border-blue-600"
                      : "border-vulcan-600"
                  } bg-vulcan-900 py-2 pl-10 pr-4 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  id="currentResin"
                  name="currentResin"
                  onChange={handleCurrentResinChange}
                  required
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">0</span>
                  <span className="text-xs text-gray-400">
                    {t("max")}: {MAX_RESIN}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex flex-col items-center">
                <div className="relative h-2 w-full rounded-full bg-vulcan-800">
                  <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-blue-600"
                    style={{
                      width: `${(validCurrentResin / MAX_RESIN) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  {t("resin_percent", {
                    percent: resinPercent,
                  })}
                </p>
              </div>
            </div>

            <p className="mb-3 text-center text-lg font-medium text-white">
              {t("or")}
            </p>

            {/* Desired Resin Section */}
            <div className="mb-6 rounded-lg border border-vulcan-600 p-4 transition hover:border-vulcan-500">
              <label
                htmlFor="desiredResin"
                className="mb-2 block text-lg font-medium text-white"
              >
                {t("desired_resin")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <img
                    src={getUrl("/resin.webp", 24)}
                    alt="Original Resin"
                    className="h-5 w-5"
                  />
                </span>
                <input
                  type="number"
                  value={validDesiredResin}
                  min={0}
                  max={160}
                  placeholder={t("desired_resin")}
                  className={`w-full rounded-md border ${
                    type === "desiredResin"
                      ? "border-blue-600"
                      : "border-vulcan-600"
                  } bg-vulcan-900 py-2 pl-10 pr-4 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  id="desiredResin"
                  name="desiredResin"
                  onChange={handleDesiredResinChange}
                  required
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-400">0</span>
                  <span className="text-xs text-gray-400">
                    {t("max")}: {MAX_RESIN}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Time & Estimated Time */}
            <div className="rounded-lg border border-vulcan-600 p-4">
              <p className="flex items-center justify-center text-center text-white">
                <span className="mr-2">{t("current_time")}:</span>
                <CurrentTime
                  format={{
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }}
                />
              </p>

              {estimatedTime && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="mt-3 flex items-center justify-center rounded-md bg-vulcan-700/50 py-2">
                      <MdOutlineTimer className="mr-2" />
                      <span className="text-sm text-gray-200">
                        {t("estimated_resin_time")}:{" "}
                        <strong>{estimatedTime}</strong>
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("estimated_resin_tooltip")}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col justify-center">
            {state.result ? (
              <div className="h-full rounded-xl bg-vulcan-900 p-4 pt-0 shadow-lg xl:inline-block">
                <h3 className="my-3 text-center text-lg font-medium text-white">
                  {t("resin_calculation_results")}
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-700 py-2 text-right">
                        <span className="mr-2 whitespace-nowrap text-white">
                          <span className="font-medium">
                            {state.result.resin}
                          </span>{" "}
                          ×
                        </span>
                      </td>
                      <td className="border-b border-gray-700 py-2">
                        <span className="text-white">
                          <span className="inline-block w-6">
                            <img
                              className="mr-1 inline-block h-6"
                              src={getUrl(state.result.originalResin.image, 28)}
                              alt={state.result.originalResin.label}
                            />
                          </span>
                          {state.result.originalResin.label}
                        </span>
                      </td>
                    </tr>
                    {state.result.condensed.condensedResin !== 0 ? (
                      <>
                        <tr>
                          <td
                            colSpan={2}
                            className="py-2 text-center text-white"
                          >
                            {t("or")}
                          </td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-700 py-2 text-right">
                            <span className="mr-2 whitespace-nowrap text-white">
                              <span className="font-medium">
                                {state.result.condensed.resin}
                              </span>{" "}
                              ×
                            </span>
                          </td>
                          <td className="border-b border-gray-700 py-2">
                            <span className="text-white">
                              <span className="inline-block w-6">
                                <img
                                  className="mr-1 inline-block h-6"
                                  src={getUrl(
                                    state.result.originalResin.image,
                                    26,
                                  )}
                                  alt={state.result.originalResin.label}
                                />
                              </span>
                              {state.result.originalResin.label}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="border-b border-gray-700 py-2 text-right">
                            <span className="mr-2 whitespace-nowrap text-white">
                              <span className="font-medium">
                                {state.result.condensed.condensedResin}
                              </span>{" "}
                              ×
                            </span>
                          </td>
                          <td className="border-b border-gray-700 py-2">
                            <span className="text-white">
                              <span className="inline-block w-6">
                                <img
                                  className="mr-1 inline-block h-6"
                                  src={getUrl(
                                    state.result.condensedResin.image,
                                    26,
                                  )}
                                  alt={state.result.condensedResin.label}
                                />
                              </span>
                              {state.result.condensedResin.label}
                            </span>
                          </td>
                        </tr>
                      </>
                    ) : null}
                    <tr>
                      <td
                        className="bg-vulcan-800/50 px-4 py-3 text-amber-300"
                        colSpan={2}
                      >
                        {t("replenished_at", {
                          timeToWait: dayjs()
                            .add(
                              state.result.millisecondsToWait,
                              "milliseconds",
                            )
                            .format("dddd HH:mm:ss"),
                          relativeTimeToWait: dayjs()
                            .add(
                              state.result.millisecondsToWait,
                              "milliseconds",
                            )
                            .fromNow(),
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-between gap-4">
                <div className="rounded-lg border border-dashed border-vulcan-600 p-8 text-center">
                  <img
                    src={getUrl("/resin.webp", 64)}
                    alt="Original Resin"
                    className="mx-auto mb-4 h-16 w-16 opacity-60"
                  />
                  {/* <p className="mb-2 text-lg text-gray-300">
                    {t("resin_calculator_hint")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t("resin_calculator_desc_short")}
                  </p> */}
                </div>
                <SubmitButton />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
