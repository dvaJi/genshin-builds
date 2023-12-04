"use client";

import { calculateResin } from "@app/actions";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import dayjs from "dayjs";
import rTime from "dayjs/plugin/relativeTime";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
dayjs.extend(rTime);

const CurrentTime = dynamic(() => import("@components/CurrentTime"), {
  ssr: false,
});

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

export function ResinCalculatorForm() {
  const [type, setType] = useState("maxResin");
  const [state, formAction] = useFormState(calculateResin, initialState);

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
        <div className="flex items-start justify-start">
          <div className="relative flex min-w-[300px] flex-col">
            <input type="hidden" name="type" value={type} />
            <p className="text-center text-white">Current Resin</p>
            <input
              type="number"
              defaultValue={0}
              min={0}
              max={160}
              placeholder="Current Resin"
              className="mb-4 w-full max-w-xl rounded border border-vulcan-600 bg-vulcan-900 p-2"
              id="currentResin"
              name="currentResin"
              onChange={() => setType("maxResin")}
              required
            />
            <p className="text-center text-white">or Desired Resin</p>
            <input
              type="number"
              defaultValue={0}
              min={0}
              max={160}
              placeholder="Desired Resin"
              className="mb-4 w-full max-w-xl rounded border border-vulcan-600 bg-vulcan-900 p-2"
              id="desiredResin"
              name="desiredResin"
              onChange={() => setType("desiredResin")}
              required
            />
            <p className="text-center text-white">
              Current Time:{" "}
              <CurrentTime
                format={{
                  weekday: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }}
              />
              {/* {currentTime
                .locale($t("calculator.resin.timeFormat"))
                .format("dddd HH:mm:ss")} */}
            </p>
          </div>
          {state.result ? (
            <div className="bg-background block min-w-[300px] rounded-xl p-4 pt-0 xl:inline-block">
              <table className="w-full">
                <tr>
                  <td className="border-b border-gray-700 py-1 text-right">
                    <span className="mr-2 whitespace-nowrap text-white">
                      {state.result.resin}x
                    </span>
                  </td>
                  <td className="border-b border-gray-700 py-1">
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
                      <td colSpan={2} className="pt-2 text-center text-white">
                        or
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-700 py-1 text-right">
                        <span className="mr-2 whitespace-nowrap text-white">
                          {state.result.condensed.resin}x
                        </span>
                      </td>
                      <td className="border-b border-gray-700 py-1">
                        <span className="text-white">
                          <span className="inline-block w-6">
                            <img
                              className="mr-1 inline-block h-6"
                              src={getUrl(state.result.originalResin.image, 26)}
                              alt={state.result.originalResin.label}
                            />
                          </span>
                          {state.result.originalResin.label}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-b border-gray-700 py-1 text-right">
                        <span className="mr-2 whitespace-nowrap text-white">
                          {state.result.condensed.condensedResin}x
                        </span>
                      </td>
                      <td className="border-b border-gray-700 py-1">
                        <span className="text-white">
                          <span className="inline-block w-6">
                            <img
                              className="mr-1 inline-block h-6"
                              src={getUrl(
                                state.result.condensedResin.image,
                                26
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
                  <td className="text-red-400" colSpan={2}>
                    Will be replenished at:{" "}
                    {dayjs()
                      .add(state.result.millisecondsToWait, "milliseconds")
                      .format("dddd HH:mm:ss")}{" "}
                    (
                    {dayjs()
                      .add(state.result.millisecondsToWait, "milliseconds")
                      .fromNow()}
                    )
                  </td>
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
