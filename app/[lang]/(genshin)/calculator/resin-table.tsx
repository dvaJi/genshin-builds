"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdArrowRightAlt } from "react-icons/md";

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
    value: 8,
  };

  const rows = Array.from(Array(step.length - 1).keys());

  const stepTime = step.map(
    (s) => new Date().getTime() + _originalResin.value * s * 60 * 1000
  );

  return (
    <div className="card block w-full overflow-x-auto whitespace-nowrap">
      <div className="table w-full">
        <div className="bg-item w-full rounded-xl p-4">
          <table className="w-full">
            <tr>
              <th className="font-display px-2 py-1 text-gray-400">
                {quantity}
              </th>
              <th className="font-display px-2 py-1 align-bottom text-gray-400">
                {time}
              </th>
            </tr>
            {rows.map((i) => (
              <tr key={i}>
                <td className="border-b border-gray-700 py-1 pl-2 text-center text-white">
                  {step[0]}
                  <MdArrowRightAlt className="mb-1 !inline-block text-gray-400" />
                  {step[i + 1]}
                  <img
                    src={_originalResin.image}
                    alt={_originalResin.label}
                    className="inline h-6 w-6"
                  />
                </td>
                <td className="border-b border-gray-700 py-1 pr-2 text-center text-white">
                  {dayjs(new Date(stepTime[i + 1]))
                    .locale("en")
                    .fromNow()}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
