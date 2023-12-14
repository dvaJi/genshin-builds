"use client";

import { getUrl } from "@lib/imgUrl";
import { MdArrowRightAlt } from "react-icons/md";

type Props = {
  heros_wit: string;
  adventurers_experience: string;
  wanderes_advice: string;
  level: string;
  items: string;
  wasted: string;
  mora: string;
};

export function LevelUpTable({
  heros_wit,
  adventurers_experience,
  wanderes_advice,
  level,
  items,
  wasted,
  mora,
}: Props) {
  let numberFormat = Intl.NumberFormat();
  const step = [1, 20, 40, 50, 60, 70, 80, 90];
  const resources = [
    {
      selected: true,
      disabled: false,
      image: getUrl("/materials/heros_wit.png", 32),
      label: heros_wit,
      id: "heros_wit",
      value: 20000,
    },
    {
      selected: true,
      disabled: false,
      image: getUrl("/materials/adventurers_experience.png", 32),
      label: adventurers_experience,
      id: "adventurers_experience",
      value: 5000,
    },
    {
      selected: true,
      disabled: false,
      image: getUrl("/materials/wanderers_advice.png", 32),
      label: wanderes_advice,
      id: "wanderers_advice",
      value: 1000,
    },
  ];
  function process() {
    let result: { usage: any[]; over: any; mora: number }[] = [];
    for (let i = 0; i < step.length - 1; i++) {
      result = [...result, calculate(step[i], step[i + 1])];
    }

    return result;
  }
  const result = process();

  function calculate(start: number, end: number) {
    const values = resources
      .filter((e) => e.selected)
      .map((e) => e.value)
      .sort((a, b) => b - a);
    const items = values.map(() => 0);

    const target = characterExp[end - 1] - characterExp[start - 1];
    let current = target;
    let max = [];

    const moraNeeded = (Math.floor(target / 1000) * 1000) / 5;

    items[0] = Math.ceil(current / values[0]);
    max.push({
      usage: [...items],
      over: current - items[0] * values[0],
    });
    items[0] = Math.ceil(current / values[0]);

    items[0] -= 1;
    items[1] = Math.ceil((current - items[0] * values[0]) / values[1]);

    max.push({
      usage: [...items],
      over: current - (items[0] * values[0] + items[1] * values[1]),
    });

    function process(usage: number[], start: number) {
      let i = start;
      if (i === values.length - 1) return;
      while (usage[i] > 0) {
        usage[i]--;

        usage[i + 1] = 0;
        let currentTotal = usage.reduce((total, e, f) => {
          total += e * values[f];
          return total;
        }, 0);
        usage[i + 1] = Math.ceil((target - currentTotal) / values[i + 1]);

        currentTotal = usage.reduce((total, e, f) => {
          total += e * values[f];
          return total;
        }, 0);
        max.push({
          usage: [...usage],
          over: target - currentTotal,
        });

        if (usage[i] === 0) i++;
        if (i === values.length - 1) break;
        process([...usage], start + 1);
      }
    }

    process([...items], 1);

    const currentMax = max.sort((a, b) => b.over - a.over)[0];

    return { usage: currentMax.usage, over: currentMax.over, mora: moraNeeded };
  }

  return (
    <div className="card block w-full overflow-x-auto whitespace-nowrap">
      <div className="table w-full">
        <div className="bg-item w-full rounded-xl p-4">
          <table>
            <tr>
              <th className="font-display px-2 text-gray-400" colSpan={3}>
                {level}
              </th>
              <th className="font-display px-2 align-bottom text-gray-400">
                {items}
              </th>
              <th className="font-display px-2 align-bottom text-gray-400">
                {wasted}
              </th>
              <th className="font-display px-2 text-right align-bottom text-gray-400">
                {mora}
              </th>
            </tr>
            {result.map((row, i) => (
              <tr key={row.mora}>
                <td className="border-b border-gray-700 py-1 pl-2 text-center text-white">
                  {step[i]}
                </td>
                <td className="border-b border-gray-700 py-1 text-center text-white">
                  <MdArrowRightAlt className="mb-1 !inline-block text-gray-400" />
                </td>
                <td className="border-b border-gray-700 py-1 pr-2 text-center text-white">
                  {step[i + 1]}
                </td>
                <td className="min-w-[180px] whitespace-nowrap border-b border-gray-700 px-2 py-1 text-white">
                  {resources.map((res, j) =>
                    row.usage[j] > 0 ? (
                      <span className="mr-2" key={res.image + i}>
                        <img
                          src={res.image}
                          alt={res.label}
                          className="inline h-6 w-6"
                        />
                        <span>{row.usage[j]}</span>
                      </span>
                    ) : null
                  )}
                </td>
                <td className="border-b border-gray-700 px-2 py-1 text-center text-white">
                  {Math.abs(row.over)}
                </td>
                <td className="border-b border-gray-700 px-2 py-1 text-right text-white">
                  {numberFormat.format(row.mora)}
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

const characterExp = [
  0, 1000, 2325, 4025, 6175, 8800, 11950, 15675, 20025, 25025, 30725, 37175,
  44400, 52450, 61375, 71200, 81950, 93675, 106400, 120175, 135050, 151850,
  169850, 189100, 209650, 231525, 254775, 279425, 305525, 333100, 362200,
  392850, 425100, 458975, 494525, 531775, 570750, 611500, 654075, 698500,
  744800, 795425, 848125, 902900, 959800, 1018875, 1080150, 1143675, 1209475,
  1277600, 1348075, 1424575, 1503625, 1585275, 1669550, 1756500, 1846150,
  1938550, 2033725, 2131725, 2232600, 2341550, 2453600, 2568775, 2687100,
  2808625, 2933400, 3061475, 3192875, 3327650, 3465825, 3614525, 3766900,
  3922975, 4082800, 4246400, 4413825, 4585125, 4760350, 4939525, 5122700,
  5338925, 5581950, 5855050, 6161850, 6506450, 6893400, 7327825, 7815450,
  8362650,
];
