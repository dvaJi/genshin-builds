"use client";

import type { ReactNode } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

import { calculateFateCount } from "@app/actions";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

const initialState = {
  message: "",
};

function SubmitButton({ text }: { text: ReactNode }) {
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
        text
      )}
    </Button>
  );
}

export function FateCountCalculatorForm() {
  const { t } = useIntl("calculator");
  const [state, formAction] = useFormState(calculateFateCount, initialState);

  const fateValues = [
    {
      id: "intertwinedFate",
      name: t("intertwinedFate"),
      image: getUrl("/intertwined_fate.webp", 32),
      amount: 0,
    },
    {
      id: "starglitter",
      name: t("starglitter"),
      image: getUrl("/starglitter.png", 32),
      amount: 0,
    },
    {
      id: "stardust",
      name: t("stardust"),
      image: getUrl("/stardust.png", 32),
      amount: 0,
    },
    {
      id: "primogem",
      name: t("primogem"),
      image: getUrl("/primogem.png", 32),
      amount: 0,
    },
    {
      id: "genesisCrystal",
      name: t("genesis_crystal"),
      image: getUrl("/genesis_crystal.webp", 32),
      amount: 0,
    },
    {
      id: "welkinMoon",
      name: t("welkin_moon_days"),
      image: getUrl("/welkin_moon.png", 32),
      amount: 0,
    },
  ];

  const parameters = [
    { id: "daysUntilPull", name: t("daysUntilPull"), amount: 0 },
    {
      id: "stardustLeft",
      name: t("stardustLeft"),
      amount: 5,
    },
  ];

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
            {fateValues.map((value) => (
              <div
                key={value.id}
                className="mb-1 rounded-xl border border-vulcan-600 p-2"
              >
                <div className="mb-1 flex flex-row items-center">
                  <img
                    src={value.image}
                    alt={value.name}
                    className="mr-2 w-6"
                    width={24}
                    height={24}
                  />
                  <p className="text-white">{value.name}</p>
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-full">
                    <input
                      id={value.id}
                      name={value.id}
                      className="mr-2 w-full rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                      type="number"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative flex min-w-[300px] flex-col">
            {parameters.map((value) => (
              <div
                key={value.id}
                className="mb-1 rounded-xl border border-vulcan-600 p-2"
              >
                <div className="mb-1 flex flex-row items-center">
                  <p className="text-white">{value.name}</p>
                </div>
                <div className="flex flex-row items-center">
                  <div className="w-full">
                    <input
                      id={value.id}
                      name={value.id}
                      className="mr-2 w-full rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                      type="number"
                      min={0}
                      step={1}
                      pattern="\d*"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex flex-col">
              <SubmitButton text={<>{t("calculate")}</>} />
            </div>
            {state.result ? (
              <div>
                <div className="block h-[fit-content] w-[fit-content] rounded-xl bg-vulcan-900 p-4 md:inline-block">
                  <table>
                    <tr>
                      <th className="pr-2 text-center text-white">
                        {t("type")}
                      </th>
                      <th className="pr-2 text-center text-white">
                        {t("amount")}
                      </th>
                      <th className="pr-2 text-right text-white">
                        {t("total_primogems")}
                      </th>
                    </tr>
                    {state.result.data.map((res) => (
                      <tr key={res.name}>
                        <td className="border-t border-gray-700 pr-2 text-white">
                          <span className="inline-flex align-middle">
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
                        <td className="border-t border-gray-700 pr-2 text-center text-white">
                          {res.amount}
                        </td>
                        <td className="border-t border-gray-700 text-right text-white">
                          {res.total}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="whitespace-nowrap border-t border-gray-700 text-right text-white"
                        colSpan={5}
                      >
                        {t("total_primogems")} {state.result.totalPrimogem}
                        <img
                          className="mr-1 inline w-6"
                          src={getUrl("/primogem.png", 32)}
                          alt="Primogem"
                          width={24}
                          height={24}
                        />
                        ({Math.floor(state.result.totalPrimogem / 160)}
                        <img
                          className="inline w-6"
                          src={getUrl("/intertwined_fate.webp", 32)}
                          alt="Fate"
                          width={24}
                          height={24}
                        />
                        )
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
