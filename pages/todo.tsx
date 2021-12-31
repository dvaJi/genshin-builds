import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData from "genshin-data";
import {
  CgArrowLongRight,
  CgChevronRight,
  CgChevronLeft,
} from "react-icons/cg";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";

import { todos as todosAtom } from "../state/todo";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";
import Button from "@components/Button";
import { useMemo, useState } from "react";
import { getUrl } from "@lib/imgUrl";
import SimpleRarityBox from "@components/SimpleRarityBox";
import clsx from "clsx";
import { format } from "date-fns";
import { Popover } from "react-tiny-popover";
import { usePopover } from "@hooks/use-popover";

type TodoProps = {
  planning: Record<string, any>;
  common: Record<string, string>;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TodoPage = ({ planning }: TodoProps) => {
  const [open, trigger, content] = usePopover(false);
  const todos = useStore(todosAtom);
  // TODO: Calculate total Resin (amount and days)
  // Tabs to select days
  // Items that do not needs resin (separated by type, and grouped by rarity)
  // Items that needs resin, separated by resin cost, by type, and grouped by rarity
  const [currentDay, setCurrentDay] = useState(format(new Date(), "iii"));

  const summary = useMemo<any>(() => {
    return todos.reduce<any>((acc, value) => {
      for (const [id, data] of Object.entries(value[4])) {
        // if (!isSunday && itemList[id].day && itemList[id].day.includes(today)) {
        //   if (todayOnly[id] === undefined) {
        //     todayOnly[id] = 0;
        //   }
        //   todayOnly[id] += amount;
        // }
        if (acc[id] === undefined) {
          console.log(data);
          acc[id] = [0, data[1], data[2]];
        }
        acc[id][0] += data[0];
      }
      return acc;
    }, {});
  }, [todos]);
  const { t } = useIntl();

  const farmToday = useMemo<any>(() => {
    const isSunday = currentDay === "Sun";
    return todos.reduce<any>((acc, value) => {
      if (isSunday || planning[currentDay].includes(value[0].id)) {
        for (const [id, data] of Object.entries(value[4])) {
          const isWeeklyBoss =
            data[1] === "talent_lvl_up_materials" && data[2] === 5;
          if (
            id !== "crown_of_insight" &&
            ["talent_lvl_up_materials", "weapon_primary_materials"].includes(
              data[1]
            ) &&
            !isWeeklyBoss
          ) {
            if (acc[id] === undefined) {
              acc[id] = [0, data[1], data[2]];
            }
            acc[id][0] += data[0];
          }
        }
      }
      return acc;
    }, {});
  }, [currentDay, planning, todos]);

  const removeTodo = (id: string) => {
    todosAtom.set(todos.filter((todo) => todo[0].id !== id));
  };

  // Move todos based on index to a new index
  const moveTodo = (id: string, index: number, newIndex: number) => {
    const todo = todos.find((todo) => todo[0].id === id);
    if (todo) {
      const newTodos = [...todos];
      newTodos.splice(index, 1);
      newTodos.splice(newIndex, 0, todo);
      todosAtom.set(newTodos);
    }
  };

  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });
  console.log(todos, summary, planning);
  return (
    <div className="px-4">
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.teams",
          defaultMessage: "Best Team Comp | Party Building Guide",
        })}
        pageDescription={t({
          id: "title.teams.description",
          defaultMessage:
            "This is a guide to making the best party in Genshin Impact. Learn how to make the best party! We introduce the best party composition for each task including exploring areas, slaying field bosses, and more!",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "best_team_comp", defaultMessage: "Best Team Comp" })}
      </h2>
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="inline-grid grid-cols-4">
        <div className="">
          <div>
            <h1>Farm Today</h1>
            <div className="flex justify-center flex-wrap">
              {Object.entries(farmToday).map(([id, data]) => (
                <div key={id}>
                  <SimpleRarityBox
                    img={getUrl(`/${data[1]}/${id}.png`, 45, 45)}
                    rarity={data[2] as any}
                    name={numFormat.format(data[0] as any)}
                    alt={id}
                    nameSeparateBlock
                    className="w-10 h-10"
                    classNameBlock="w-10"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full rounded border border-vulcan-900 bg-vulcan-800">
            <h1>Summary</h1>
            <div className="flex justify-center flex-wrap">
              {Object.entries(summary).map(([id, data]) => (
                <div key={id} className="">
                  <SimpleRarityBox
                    img={getUrl(`/${data[1]}/${id}.png`, 45, 45)}
                    rarity={data[2] as any}
                    name={numFormat.format(data[0] as any)}
                    alt={id}
                    nameSeparateBlock
                    className="w-10 h-10"
                    classNameBlock="w-10"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 inline-grid grid-cols-4 gap-3 m-3">
          {todos.map((todo, i) => (
            <div
              key={todo[0].id + i}
              className="flex w-full h-full rounded border border-vulcan-900 bg-vulcan-800"
            >
              <div className="flex flex-col w-full relative flex-shrink-0">
                <div className="flex justify-between p-2 mx-2">
                  <p className="text-lg font-semibold text-white">
                    {todo[0].name}
                  </p>
                  <div>
                    <button
                      onClick={() => moveTodo(todo[0].id, i, i - 1)}
                      disabled={i === 0}
                      className="text-white border-2 border-white border-opacity-10 rounded-none px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600 rounded-l-xl"
                    >
                      <CgChevronLeft />
                    </button>
                    <button
                      onClick={() => moveTodo(todo[0].id, i, i + 1)}
                      disabled={i + 1 === todos.length}
                      className="text-white border-2 border-white border-opacity-10 rounded-none px-1 py-1 transition duration-100 hover:border-vulcan-500 focus:border-vulcan-500 focus:outline-none disabled:opacity-50 disabled:border-gray-600 rounded-r-xl"
                    >
                      <CgChevronRight />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col p-2 flex-grow justify-between">
                  <div className="flex items-center mb-2 min-h-[108px]">
                    <div className="flex justify-center mx-auto">
                      <div
                        className="w-24 h-24 rounded-md shadow-md overflow-hidden bg-cover"
                        style={{
                          backgroundImage: `url(${IMGS_CDN}/bg_${todo[0].r}star.png)`,
                        }}
                      >
                        <img
                          draggable="false"
                          height="96"
                          width="96"
                          src={getUrl(
                            todo[1] === "character"
                              ? `/characters/${todo[0].id}/${todo[0].id}_portrait.png`
                              : `/weapons/${todo[0].id}.png`,
                            96,
                            96
                          )}
                          alt={todo[0].name}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col h-full justify-center">
                      <div className="flex flex-col">
                        <div className="flex">
                          <div>
                            <h4 className="w-20 text-sm text-center font-semibold text-white">
                              Levels
                            </h4>
                            <div className="flex justify-center text-sm">
                              <div>
                                <p>{todo[2][0]}</p>
                              </div>
                              <div>
                                <CgArrowLongRight className="h-full mx-2" />
                              </div>
                              <div className="inline-flex justify-center items-center">
                                <p>{todo[2][2]}</p>
                                <img
                                  src={getUrl(`/ascension.png`, 16, 16)}
                                  className={clsx("w-3 h-3", {
                                    "opacity-100": todo[2][3],
                                    "opacity-0": !todo[2][3],
                                  })}
                                  alt="ascension"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {Object.keys(todo[3]).length > 0 && (
                        <div className="flex flex-col">
                          <h4 className="w-20 text-sm text-center font-semibold text-white">
                            Talents
                          </h4>
                          <div className="flex">
                            <div>
                              {Object.entries(todo[3]).map(([id, value]) => (
                                <div key={id} className="flex">
                                  <div className="flex justify-center w-20 text-xs">
                                    <div>
                                      <p>{value[0]}</p>
                                    </div>
                                    <div>
                                      <CgArrowLongRight className="h-full mx-2" />
                                    </div>
                                    <div>
                                      <p>{value[1]}</p>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {t({ id: id, defaultMessage: id })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center flex-wrap">
                    {Object.entries(todo[4]).map(([id, data]) => (
                      <div key={id} className="cursor-pointer" {...trigger}>
                        <SimpleRarityBox
                          img={getUrl(`/${data[1]}/${id}.png`, 45, 45)}
                          rarity={data[2] as any}
                          name={numFormat.format(data[0] as any)}
                          alt={id}
                          nameSeparateBlock
                          className="w-10 h-10"
                          classNameBlock="w-10"
                        />
                        {open && <div {...content}>Popover content</div>}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mx-2">
                    <span className="text-lg text-white">#{i + 1}</span>
                    <Button className="" onClick={() => removeTodo(todo[0].id)}>
                      X Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const talentsPlanning: Record<
    string,
    any
  > = require(`../_content/data/talents.json`);

  // const genshinData = new GenshinData({ language: localeToLang(locale) });
  // const characterExpMaterials = await genshinData.characterExpMaterials();
  // const commonMaterials = await genshinData.commonMaterials();
  // const elementalStoneMaterials = await genshinData.elementalStoneMaterials();
  // const jewelsMaterials = await genshinData.jewelsMaterials();
  // const localMaterials = await genshinData.localMaterials();
  // const talentLvlUpMaterials = await genshinData.talentLvlUpMaterials();
  // const weaponExpMaterials = await genshinData.weaponExpMaterials();
  // const talentLvlUpMaterials = await genshinData.();

  const planning = Object.entries(talentsPlanning).reduce<
    Record<string, string[]>
  >((acc, cur) => {
    const [_, data] = cur;

    Object.entries(data).forEach(([day, iId]) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(...(iId as string[]));
    });

    return acc;
  }, {});

  return {
    props: { planning, lngDict },
  };
};

export default TodoPage;
