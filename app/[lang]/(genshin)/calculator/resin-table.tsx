"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdArrowRightAlt } from "react-icons/md";
import { MdOutlineTimer } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import { getUrl } from "@lib/imgUrl";

dayjs.extend(relativeTime);

type Props = {
  quantity: string;
  time: string;
  originalResin: string;
};

export function ResinTable({ quantity, time, originalResin }: Props) {
  const step = [0, 15, 30, 45, 60, 75, 90, 105, 120, 145, 160];

  const _originalResin = {
    id: "original_resin",
    image: getUrl("/resin.webp", 32),
    label: originalResin,
    value: 8, // minutes per resin
  };

  const rows = Array.from(Array(step.length - 1).keys());

  const stepTime = step.map(
    (s) => new Date().getTime() + _originalResin.value * s * 60 * 1000,
  );

  return (
    <div className="card w-full overflow-hidden">
      <div className="rounded-xl bg-vulcan-900 p-4 shadow-lg">
        <h3 className="mb-3 text-center text-lg font-medium text-white">
          Resin Replenishment Time
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-300">
                  {quantity}
                </th>
                <th className="px-3 py-2 text-right font-medium text-gray-300">
                  {time}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i} className="transition hover:bg-vulcan-800/30">
                  <td className="border-b border-gray-700 py-2 pl-3 text-white">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{step[0]}</span>
                      <MdArrowRightAlt
                        className="text-gray-400"
                        aria-label="to"
                      />
                      <span className="font-medium">{step[i + 1]}</span>
                      <img
                        src={_originalResin.image}
                        alt={_originalResin.label}
                        className="ml-1 h-5 w-5"
                        width={20}
                        height={20}
                      />
                    </div>
                  </td>
                  <td className="border-b border-gray-700 py-2 pr-3 text-right">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="inline-flex items-center rounded-full bg-vulcan-800 px-3 py-1">
                          <MdOutlineTimer className="mr-1 text-blue-400" />
                          <span className="font-medium text-white">
                            {dayjs(new Date(stepTime[i + 1]))
                              .locale("en")
                              .fromNow()}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <div className="text-center">
                          <p className="font-medium">
                            {dayjs(new Date(stepTime[i + 1])).format("HH:mm")}
                          </p>
                          <p className="text-xs">
                            {step[i + 1] * _originalResin.value} minutes
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-gray-700 p-2 text-sm text-gray-300">
          <div className="flex items-center rounded bg-vulcan-800 px-2 py-1">
            <img
              src={_originalResin.image}
              alt={_originalResin.label}
              className="mr-1 h-5 w-5"
              width={20}
              height={20}
            />
            <span>
              1 {_originalResin.label} = {_originalResin.value} min
            </span>
          </div>
          <div className="rounded bg-vulcan-800 px-2 py-1">
            <span>160 {_originalResin.label} = ~21.3 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
