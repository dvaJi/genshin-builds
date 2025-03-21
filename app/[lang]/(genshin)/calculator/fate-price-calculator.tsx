"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";
import { MdCheck, MdClose, MdHelpOutline } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import Button from "@components/ui/Button";
import { getUrl } from "@lib/imgUrl";

import { calculateFatePrice } from "./actions";

const initialState = {
  message: "",
};

function SubmitButton({
  type,
  text,
  disabled = false,
}: {
  type: string;
  text: ReactNode;
  disabled?: boolean;
}) {
  const t = useTranslations("Genshin.calculator");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      name="action"
      value={type}
      aria-disabled={pending || disabled}
      disabled={disabled}
      className="w-full disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? (
        <div className="flex items-center justify-center py-2">
          <FaSpinner className="mr-2 animate-spin" />
          <span>{t("calculating")}</span>
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
  const t = useTranslations("Genshin.calculator");
  const [currency, setCurrency] = useState<string>("");
  const [usedPrices, setUsedPrices] = useState<number[]>([]);
  const [values, setValues] = useState<typeof __values>(__values);
  const [currencyLabel, setCurrencyLabel] = useState<string>("");
  const [money, setMoney] = useState<number>(200);
  const [fate, setFate] = useState<number>(80);
  const [state, formAction] = useFormState(calculateFatePrice, initialState);

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

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedCurrency = e.target.value;
    const selectedPrice = prices[selectedCurrency as keyof typeof prices];
    setUsedPrices(selectedPrice.values.slice());
    setCurrencyLabel(selectedPrice.currency);
    setCurrency(selectedCurrency);
  };

  const updatePackageFirstTime = (index: number, isFirstTime: boolean) => {
    const newValues = [...values];
    newValues[index].firstTime = isFirstTime;
    setValues(newValues);
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const newPrices = [...usedPrices];
    newPrices[index] = newPrice;
    setUsedPrices(newPrices);
  };

  const formatCurrency = (value: number) => {
    if (currency === "IDR" || currency === "YEN") {
      return numberFormat.format(value);
    }
    return value.toFixed(2);
  };

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

        <div className="flex flex-col items-stretch justify-between gap-6 lg:flex-row lg:gap-8">
          {/* Currency and Package Configuration */}
          <div className="relative flex min-w-[300px] flex-col space-y-4">
            <div className="rounded-lg border border-vulcan-600 p-4">
              <label
                htmlFor="currency"
                className="mb-2 block text-lg font-medium text-white"
              >
                {t("select_currency")}
              </label>
              <select
                id="currency"
                name="currency"
                className="w-full rounded border-vulcan-600 bg-vulcan-900 p-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={currency}
                onChange={handleCurrencyChange}
                required
              >
                <option value="" disabled>
                  {t("select_currency")}
                </option>
                {currencies.map((currencyOption) => (
                  <option
                    key={currencyOption.value}
                    value={currencyOption.value}
                  >
                    {currencyOption.label}
                  </option>
                ))}
              </select>

              {!currency && (
                <p className="mt-1 text-xs text-amber-400">
                  {t("please_select_currency")}
                </p>
              )}
            </div>

            {currency && (
              <div className="rounded-lg border border-vulcan-600 p-4">
                <h3 className="mb-3 text-lg font-medium text-white">
                  {t("top_up_packages")}
                </h3>
                <div className="space-y-3">
                  {values.map((value, i) => (
                    <div
                      key={value.amount}
                      className="rounded border border-vulcan-600 bg-vulcan-800/50 p-3 transition hover:border-vulcan-500"
                    >
                      <div className="mb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={getUrl("/genesis_crystal.webp", 32)}
                            alt="Genesis Crystal"
                            width={24}
                            height={24}
                            className="mr-2 w-6"
                          />
                          <div>
                            <p className="text-white">
                              {numberFormat.format(value.amount)} +{" "}
                              {numberFormat.format(
                                value.firstTime ? value.amount : value.bonus,
                              )}{" "}
                              ={" "}
                              <strong>
                                {numberFormat.format(
                                  value.amount +
                                    (value.firstTime
                                      ? value.amount
                                      : value.bonus),
                                )}
                              </strong>
                            </p>
                            <p className="text-xs text-gray-400">
                              {value.firstTime
                                ? t("first_time_bonus_active")
                                : t("standard_bonus")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row items-center gap-3">
                        <div className="flex-1">
                          <label
                            htmlFor={`usedPrices[${i}]`}
                            className="sr-only"
                          >
                            {t("price_in_currency", {
                              currency: currencyLabel,
                            })}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                              {currencyLabel}
                            </span>
                            <input
                              id={`usedPrices[${i}]`}
                              name={`usedPrices[${i}]`}
                              className="w-full rounded border-vulcan-600 bg-vulcan-900 py-2 pl-8 pr-2 text-right transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              value={formatCurrency(usedPrices[i] || 0)}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                  handlePriceChange(i, value);
                                }
                              }}
                              type="text"
                              inputMode="decimal"
                            />
                          </div>
                        </div>

                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`firstTime[${i}]`}
                            name={`firstTime[${i}]`}
                            className="h-4 w-4 rounded border-vulcan-600 bg-vulcan-900 accent-blue-600"
                            onChange={(e) =>
                              updatePackageFirstTime(i, e.target.checked)
                            }
                            checked={value.firstTime}
                          />
                          <span className="text-sm text-white">
                            {t("first_time")}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                className="text-gray-400 hover:text-white"
                              >
                                <MdHelpOutline size={14} />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {t("first_time_help")}
                            </TooltipContent>
                          </Tooltip>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calculation Options */}
          <div className="flex flex-col space-y-6">
            {currency && (
              <>
                <div className="rounded-lg border border-vulcan-600 p-4">
                  <h3 className="mb-3 text-center text-lg font-medium text-white">
                    {t("calculate_by_money")}
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="mb-3 w-full">
                      <label
                        htmlFor="money"
                        className="mb-1 block text-sm text-gray-300"
                      >
                        {t("total_money")}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                          {currencyLabel}
                        </span>
                        <input
                          id="money"
                          placeholder={t("enter_amount")}
                          name="money"
                          value={money}
                          type="number"
                          min="1"
                          className="w-full rounded border-vulcan-600 bg-vulcan-900 py-2 pl-8 pr-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          onChange={(e) =>
                            setMoney(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>

                    <SubmitButton
                      type="calculateByMoney"
                      disabled={money <= 0}
                      text={
                        <span className="flex items-center justify-center">
                          {t("calculateByMoney", {
                            currencyLabel,
                            money: numberFormat.format(money),
                          })}
                        </span>
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex h-0.5 w-16 bg-vulcan-600"></div>
                  <p className="mx-3 text-center text-gray-400">{t("or")}</p>
                  <div className="flex h-0.5 w-16 bg-vulcan-600"></div>
                </div>

                <div className="rounded-lg border border-vulcan-600 p-4">
                  <h3 className="mb-3 text-center text-lg font-medium text-white">
                    {t("calculate_by_fate")}
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="mb-3 w-full">
                      <label
                        htmlFor="fate"
                        className="mb-1 block text-sm text-gray-300"
                      >
                        {t("total_fate")}
                      </label>
                      <div className="relative">
                        <input
                          id="fate"
                          placeholder={t("enter_fate_amount")}
                          value={fate}
                          name="fate"
                          type="number"
                          min="1"
                          className="w-full rounded border-vulcan-600 bg-vulcan-900 px-3 py-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          onChange={(e) =>
                            setFate(parseInt(e.target.value) || 0)
                          }
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center">
                          <img
                            className="w-6"
                            src={getUrl("/intertwined_fate.webp", 32)}
                            alt="Fate"
                          />
                        </span>
                      </div>
                    </div>

                    <SubmitButton
                      type="calculateByFate"
                      disabled={fate <= 0}
                      text={
                        <span className="flex items-center justify-center">
                          {t("calculateByFate", {
                            fate: fate.toString(),
                          })}
                          <img
                            className="ml-1 inline w-6"
                            src={getUrl("/intertwined_fate.webp", 32)}
                            alt="Fate"
                          />
                        </span>
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {!currency && (
              <div className="rounded-lg border border-dashed border-vulcan-600 p-8 text-center">
                <p className="text-gray-400">{t("select_currency_first")}</p>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="flex-1">
            {state.result ? (
              <div className="w-full rounded-xl bg-vulcan-900 p-4 shadow-lg">
                <h3 className="mb-4 text-center text-xl font-medium text-white">
                  {t("calculation_results")}
                </h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="pb-2 pr-2 text-center text-white">
                        {t("amount")}
                      </th>
                      <th className="pb-2 pr-2 text-right text-white">
                        {t("genesis")}
                      </th>
                      <th className="pb-2 pr-2 text-center text-white">
                        {t("bonus_2x")}
                      </th>
                      <th className="pb-2 pr-2 text-right text-white">
                        {t("total")}
                      </th>
                      <th className="pb-2 text-right text-white">
                        {t("price")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.result.data.map((res) => (
                      <tr
                        key={
                          res.amount + (res.firstTime ? "first" : "standard")
                        }
                      >
                        <td className="border-t border-gray-700 py-2 pr-2 text-center text-white">
                          {res.qty}×
                        </td>
                        <td className="border-t border-gray-700 py-2 pr-2 text-right text-white">
                          {res.amount}
                        </td>
                        <td className="border-t border-gray-700 py-2 pr-2 text-center text-white">
                          {res.firstTime ? (
                            <MdCheck className="mx-auto text-green-500" />
                          ) : (
                            <MdClose className="mx-auto text-red-500" />
                          )}
                        </td>
                        <td className="border-t border-gray-700 py-2 pr-2 text-right text-white">
                          {numberFormat.format(
                            (res.amount +
                              (res.firstTime ? res.amount : res.bonus)) *
                              res.qty,
                          )}
                        </td>
                        <td className="border-t border-gray-700 py-2 text-right text-white">
                          {currencyLabel}
                          {numberFormat.format(res.price * res.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        className="whitespace-nowrap border-t-2 border-gray-600 py-3 text-right font-medium text-white"
                        colSpan={5}
                      >
                        {t("total_genesis")}{" "}
                        <span className="font-bold">
                          {numberFormat.format(state.result.resultTotal)}
                        </span>
                        <img
                          className="mx-1 inline w-6"
                          src={getUrl("/genesis_crystal.webp", 32)}
                          alt="Genesis"
                        />
                        (
                        <span className="font-bold">
                          {Math.floor(state.result.resultTotal / 160)}
                        </span>
                        <img
                          className="mx-1 inline w-6"
                          src={getUrl("/intertwined_fate.webp", 32)}
                          alt="Fate"
                        />
                        )
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="whitespace-nowrap border-t border-gray-700 py-2 text-right font-medium text-white"
                        colSpan={5}
                      >
                        {t("total_price")}{" "}
                        <span className="font-bold">
                          {currencyLabel}
                          {numberFormat.format(state.result.resultTotalPrice)}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : currency ? (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-lg border border-dashed border-vulcan-600 p-8 text-center">
                  <p className="text-gray-400">
                    {t("enter_values_and_calculate")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
