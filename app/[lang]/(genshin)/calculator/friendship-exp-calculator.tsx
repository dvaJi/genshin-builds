"use client";

import { useActionState, useState } from "react";
import { MdHelpOutline } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";

import { calculateFriendshipExp } from "./actions";

const initialState = {
  message: "",
};

export function FriendshipExpCalculatorForm() {
  const { t } = useIntl("calculator");
  const ar = 50;
  const [friendshipLevel, setFriendshipLevel] = useState<number | null>(null);
  const [expPercentage, setExpPercentage] = useState(20);
  const [randomEvents, setRandomEvents] = useState(0);
  const [state, formAction] = useActionState(
    calculateFriendshipExp,
    initialState,
  );

  // Validation function for friendly level
  const isFormValid = friendshipLevel !== null;

  return (
    <div className="card">
      <form action={formAction} className="space-y-6">
        {state?.message && (
          <div
            aria-live="polite"
            role="status"
            className="rounded-md bg-red-500/20 p-3 text-center text-red-200"
          >
            {state.message}
          </div>
        )}

        <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex min-w-[300px] max-w-md flex-col space-y-6">
            <div className="rounded-lg border border-vulcan-600 p-4">
              <input type="hidden" name="ar" value={ar} />

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="friendshipLevel"
                    className="block text-sm font-medium text-white"
                  >
                    {t("current_friendship_level")}
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                      >
                        <MdHelpOutline size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t({
                        id: "friendship_level_help",
                        defaultMessage:
                          "Select your character's current friendship level",
                      })}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <select
                  id="friendshipLevel"
                  name="friendshipLevel"
                  className="w-full rounded border-vulcan-600 bg-vulcan-900 p-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={friendshipLevel || ""}
                  onChange={(e) =>
                    setFriendshipLevel(parseInt(e.target.value) || null)
                  }
                  required
                >
                  <option value="" disabled>
                    {t("select_friendship_level")}
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {!friendshipLevel && (
                  <p className="mt-1 text-xs text-amber-400">
                    {t("please_select_level")}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="block text-sm font-medium text-white"
                    htmlFor="expPercentage"
                  >
                    {t("current_exp_bar")} - {expPercentage}%
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                      >
                        <MdHelpOutline size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t({
                        id: "exp_percentage_help",
                        defaultMessage:
                          "Current progress in the friendship EXP bar",
                      })}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    id="expPercentage"
                    name="expPercentage"
                    type="range"
                    min="0"
                    max="100"
                    value={expPercentage}
                    onChange={(e) => setExpPercentage(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-vulcan-700"
                  />
                  <span className="w-10 text-center text-sm font-medium">
                    {expPercentage}%
                  </span>
                </div>

                <div className="mt-2 flex w-full justify-between text-xs text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="block text-sm font-medium text-white">
                    {t("randomEvents")}
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                      >
                        <MdHelpOutline size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t({
                        id: "random_events_help",
                        defaultMessage:
                          "Daily random events that give friendship EXP",
                      })}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-vulcan-600 bg-vulcan-800 text-xl text-white transition hover:bg-vulcan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={randomEvents === 0}
                    onClick={() =>
                      setRandomEvents(Math.max(0, randomEvents - 1))
                    }
                    aria-label={t("decrease_random_events")}
                  >
                    −
                  </button>

                  <div className="relative mx-4 flex-1">
                    <input
                      id="randomEvents"
                      name="randomEvents"
                      type="number"
                      className="w-full rounded border-vulcan-600 bg-vulcan-900 p-2 text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={randomEvents}
                      onChange={(e) =>
                        setRandomEvents(
                          Math.max(0, Math.min(10, Number(e.target.value))),
                        )
                      }
                      min="0"
                      max="10"
                      aria-label={t("randomEvents")}
                    />

                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
                      <span>0</span>
                      <span>10 (max)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-vulcan-600 bg-vulcan-800 text-xl text-white transition hover:bg-vulcan-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={randomEvents === 10}
                    onClick={() =>
                      setRandomEvents(Math.min(10, randomEvents + 1))
                    }
                    aria-label={t("increase_random_events")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t({ id: "calculate", defaultMessage: "Calculate" })}
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            {state.result ? (
              <div className="w-full max-w-md rounded-xl bg-vulcan-900 p-6 shadow-lg">
                <h3 className="mb-4 text-center text-xl font-medium text-white">
                  {t({
                    id: "friendship_calculation_results",
                    defaultMessage: "Friendship Calculation Results",
                  })}
                </h3>
                <p className="mb-4 text-center text-gray-400">
                  {t("based_on_ar", { ar: ar.toString() })}
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg bg-vulcan-800/50 p-4">
                    <h4 className="text-center text-lg font-bold text-white">
                      {t("_days", { day: state.result.result.toString() })}
                    </h4>
                    <p className="text-center text-gray-300">
                      {t("friendship_result")}
                    </p>
                  </div>

                  <div className="rounded-lg bg-vulcan-800/50 p-4">
                    <h4 className="text-center text-lg font-bold text-white">
                      {t("_days", {
                        day: state.result.resultSerenitea.toString(),
                      })}
                    </h4>
                    <p className="text-center text-gray-300">
                      {t("serenitea_result")}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-vulcan-600 p-8 text-center">
                <p className="text-gray-400">
                  {t({
                    id: "enter_friendship_values_and_calculate",
                    defaultMessage:
                      "Enter your character's friendship values and click Calculate to see results",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
