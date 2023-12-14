"use client";

import { calculateFriendshipExp } from "@app/actions";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { t } = useIntl("calculator");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <div className="flex justify-center py-4">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        t({ id: "calculate", defaultMessage: "Calculate" })
      )}
    </Button>
  );
}

export function FriendshipExpCalculatorForm() {
  const { t } = useIntl("calculator");
  const ar = 50;
  const [expPercentage, setExpPercentage] = useState(20);
  const [randomEvents, setRandomEvents] = useState(0);
  const [state, formAction] = useFormState(
    calculateFriendshipExp,
    initialState
  );

  return (
    <div className="card">
      <form action={formAction}>
        {state?.message && (
          <div
            aria-live="polite"
            role="status"
            className="text-center text-red-500"
          >
            {state.message}
          </div>
        )}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
          <div className="relative flex min-w-[300px] flex-col">
            <input type="hidden" name="ar" value={ar} />
            <select
              id="friendshipLevel"
              name="friendshipLevel"
              className="rounded border-vulcan-600 bg-vulcan-900"
              required
            >
              <option value={undefined} disabled selected>
                {t("current_friendship_level")}
              </option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
            </select>

            <label
              className="mb-2 mt-4 block text-center text-white"
              htmlFor="expPercentage"
            >
              {t("current_exp_bar")} - {expPercentage}%
            </label>
            <input
              id="expPercentage"
              name="expPercentage"
              type="range"
              min="0"
              max="100"
              value={expPercentage}
              onChange={(e) => setExpPercentage(Number(e.target.value))}
            />
            <p className="mb-2 mt-4 text-center">{t("randomEvents")}</p>
            <div className="mb-4 flex items-center justify-center">
              <button
                type="button"
                className="text-2xl text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={randomEvents === 0}
                onClick={() => setRandomEvents(Math.max(0, randomEvents - 1))}
              >
                −
              </button>
              <input
                id="randomEvents"
                name="randomEvents"
                type="number"
                className="mx-2 w-12 rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                value={randomEvents}
                onChange={(e) =>
                  setRandomEvents(
                    Math.max(0, Math.min(10, Number(e.target.value)))
                  )
                }
                min="0"
                max="10"
              />
              <button
                type="button"
                className="text-2xl text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={randomEvents === 10}
                onClick={() => setRandomEvents(Math.min(10, randomEvents + 1))}
              >
                +
              </button>
            </div>
          </div>

          {state.result ? (
            <div className="mt-2 block rounded-xl bg-vulcan-900 p-4 xl:inline-block">
              <p className="block text-center text-gray-400">
                {t("based_on_ar", { ar: ar.toString() })}
              </p>
              <table className="text-gray-300">
                <tr>
                  <td className="whitespace-nowrap border-b border-gray-700 pb-1 pr-4 text-xl font-bold text-white">
                    {t("_days", { day: state.result.result.toString() })}
                  </td>
                  <td className="border-b border-gray-700 pb-1">
                    {t("friendship_result")}
                  </td>
                </tr>
                <tr>
                  <td className="whitespace-nowrap pr-4 pt-1 text-xl font-bold text-white">
                    {t("_days", {
                      day: state.result.resultSerenitea.toString(),
                    })}
                  </td>
                  <td className="pt-1">{t("serenitea_result")}</td>
                </tr>
              </table>
            </div>
          ) : null}
          <div className="flex min-h-[80px] w-full items-end justify-center">
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}
