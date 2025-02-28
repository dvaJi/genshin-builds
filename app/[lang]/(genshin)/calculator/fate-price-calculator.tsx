"use client";

import { type ReactNode, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { MdCheck, MdClose } from "react-icons/md";

import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

import { calculateFatePrice } from "./actions";

const initialState = {
  message: "",
};

function SubmitButton({ type, text }: { type: string; text: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      name="action"
      value={type}
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

const __values = [
  { amount: 60, bonus: 0, firstTime: true },
  { amount: 300, bonus: 30, firstTime: true },
  { amount: 980, bonus: 110, firstTime: true },
  { amount: 1980, bonus: 260, firstTime: true },
  { amount: 3280, bonus: 600, firstTime: true },
  { amount: 6480, bonus: 1600, firstTime: true },
];

const prices = {
  USD: {
    currency: "$",
    values: [0.99, 4.99, 14.99, 29.99, 49.99, 99.99],
  },
  IDR: {
    currency: "Rp",
    values: [16000, 79000, 249000, 479000, 799000, 1599000],
  },
  EUR: {
    currency: "€",
    values: [0.99, 4.99, 14.99, 29.99, 49.99, 99.99],
  },
  BRL: {
    currency: "R$",
    values: [4.9, 27.9, 84.9, 169.9, 279.9, 549.9],
  },
  MYR: {
    currency: "RM",
    values: [3.9, 19.9, 59.9, 129.9, 199.9, 399.9],
  },
  GBP: {
    currency: "£",
    values: [0.89, 4.49, 12.99, 25.99, 44.99, 89.99],
  },
  CNY: {
    currency: "¥",
    values: [6.0, 30.0, 98.0, 198.0, 328.0, 648.0],
  },
  SGD: {
    currency: "S$",
    values: [1.48, 6.98, 21.98, 44.98, 68.98, 148.98],
  },
  YEN: {
    currency: "¥",
    values: [120, 610, 1840, 3680, 6100, 12000],
  },
  Custom: {
    currency: "Custom",
    values: [0.99, 4.99, 14.99, 29.99, 49.99, 99.99],
  },
};

export function FatePriceCalculatorForm() {
  const { t } = useIntl("calculator");
  const [currency, setCurrency] = useState<string>("");
  const [usedPrices, setUsedPrices] = useState<number[]>([]);
  const [values, setValues] = useState<typeof __values>(__values);
  const [currencyLabel, setCurrencyLabel] = useState<string>("");
  const [money, setMoney] = useState<number>(200);
  const [fate, setFate] = useState<number>(80);
  const [state, formAction] = useActionState(calculateFatePrice, initialState);

  const currencies = [
    { label: "USD ($)", value: "USD" },
    { label: "IDR (Rp)", value: "IDR" },
    { label: "EUR (€)", value: "EUR" },
    { label: "BRL (R$)", value: "BRL" },
    { label: "MYR (RM)", value: "MYR" },
    { label: "GBP (£)", value: "GBP" },
    { label: "CNY (¥)", value: "CNY" },
    { label: "SGD (S$)", value: "SGD" },
    { label: "YEN (円)", value: "YEN" },
    { label: "Custom", value: "Custom" },
  ];

  const numberFormat = Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

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
            <select
              id="currency"
              name="currency"
              className="rounded border-vulcan-600 bg-vulcan-900"
              value={currency}
              onChange={(e) => {
                e.preventDefault();
                const selectedPrice =
                  prices[e.target.value as keyof typeof prices];
                setUsedPrices(selectedPrice.values.slice());
                setCurrencyLabel(selectedPrice.currency);
                setCurrency(e.target.value);
              }}
              required
            >
              <option value="" disabled>
                {t("select_currency")}
              </option>
              {currencies.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>

            {currency !== "" ? (
              <div className="mt-2">
                {values.map((value, i) => (
                  <div
                    key={value.amount}
                    className="mb-1 rounded border border-vulcan-600 p-2"
                  >
                    <div className="mb-1 flex flex-row items-center">
                      <img
                        src={getUrl("/genesis_crystal.webp", 32)}
                        alt="Genesis Crystal"
                        width={24}
                        height={24}
                        className="mr-2 w-6"
                      />
                      <p className="text-white">
                        {numberFormat.format(value.amount)} +{" "}
                        {numberFormat.format(
                          value.firstTime ? value.amount : value.bonus,
                        )}{" "}
                        ={" "}
                        {numberFormat.format(
                          value.amount +
                            (value.firstTime ? value.amount : value.bonus),
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="">
                        <input
                          id={`usedPrices[${i}]`}
                          name={`usedPrices[${i}]`}
                          className="mr-2 w-24 rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                          value={usedPrices[i]}
                          type="number"
                        />
                      </div>
                      <div className="flex flex-row items-center">
                        <input
                          type="checkbox"
                          id={`firstTime[${i}]`}
                          name={`firstTime[${i}]`}
                          className="mr-2"
                          onChange={(e) => {
                            const newValues = [...values];
                            newValues[i].firstTime = e.target.checked;
                            setValues(newValues);
                          }}
                          defaultChecked={value.firstTime}
                        />
                        <p className="text-white">{t("first_time")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {currency !== "" ? (
              <div className="flex flex-col">
                <input
                  placeholder={t("total_money")}
                  name="money"
                  value={money}
                  type="number"
                  className="rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                  onChange={(e) => {
                    e.preventDefault();
                    setMoney(parseInt(e.target.value));
                  }}
                />
                <div className="mb-1" />
                <SubmitButton
                  type="calculateByMoney"
                  text={
                    <>
                      {t("calculateByMoney", {
                        currencyLabel,
                        money: numberFormat.format(money),
                      })}
                    </>
                  }
                />
                <p className="my-6 text-center text-white">OR</p>
                <input
                  placeholder={t("total_fate")}
                  value={fate}
                  name="fate"
                  type="number"
                  className="rounded border-vulcan-600 bg-vulcan-900 p-1 text-center"
                  onChange={(e) => {
                    e.preventDefault();
                    setFate(parseInt(e.target.value));
                  }}
                />
                <div className="mb-1" />
                <SubmitButton
                  type="calculateByFate"
                  text={
                    <>
                      {t("calculateByFate", {
                        fate: fate.toString(),
                      })}
                      {
                        <img
                          className="ml-1 inline w-6"
                          src={getUrl("/intertwined_fate.webp", 32)}
                          alt="Fate"
                        />
                      }
                    </>
                  }
                />
              </div>
            ) : null}
          </div>
          <div>
            {state.result ? (
              <div className="block h-[fit-content] w-[fit-content] rounded-xl bg-vulcan-900 p-4 md:inline-block">
                <table>
                  <tr>
                    <th className="pr-2 text-right text-white">
                      {t("amount")}
                    </th>
                    <th className="pr-2 text-right text-white">
                      {t("genesis")}
                    </th>
                    <th className="pr-2 text-center text-white">
                      {t("bonus_2x")}
                    </th>
                    <th className="pr-2 text-right text-white">{t("total")}</th>
                    <th className="text-right text-white">{t("price")}</th>
                  </tr>
                  {state.result.data.map((res) => (
                    <tr key={res.amount}>
                      <td className="border-t border-gray-700 pr-2 text-right text-white">
                        {res.qty}X
                      </td>
                      <td className="border-t border-gray-700 pr-2 text-right text-white">
                        {res.amount}
                      </td>
                      <td className="border-t border-gray-700 pr-2 text-center text-white">
                        {res.firstTime ? <MdCheck /> : <MdClose />}
                      </td>
                      <td className="border-t border-gray-700 pr-2 text-right text-white">
                        {numberFormat.format(
                          (res.amount +
                            (res.firstTime ? res.amount : res.bonus)) *
                            res.qty,
                        )}
                      </td>
                      <td className="border-t border-gray-700 text-right text-white">
                        {numberFormat.format(res.price * res.qty)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      className="whitespace-nowrap border-t border-gray-700 text-right text-white"
                      colSpan={5}
                    >
                      {t("total_genesis")}{" "}
                      {numberFormat.format(state.result.resultTotal)}
                      <img
                        className="mr-1 inline w-6"
                        src={getUrl("/genesis_crystal.webp", 32)}
                        alt="Genesis"
                      />
                      ({Math.floor(state.result.resultTotal / 160)}
                      <img
                        className="inline w-6"
                        src={getUrl("/intertwined_fate.webp", 32)}
                        alt="Fate"
                      />
                      )
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="whitespace-nowrap border-t border-gray-700 text-right text-white"
                      colSpan={5}
                    >
                      {t("total_price")}{" "}
                      {prices[currency as keyof typeof prices].currency}
                      {numberFormat.format(state.result.resultTotalPrice)}
                    </td>
                  </tr>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
