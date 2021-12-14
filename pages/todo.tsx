import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData from "genshin-data";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";

import { todos as todosAtom } from "../state/todo";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { TeamFull } from "interfaces/teams";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import Button from "@components/Button";
import { useMemo } from "react";
import { getUrl } from "@lib/imgUrl";
import SimpleRarityBox from "@components/SimpleRarityBox";

type TodoProps = {
  teams: TeamFull[];
  common: Record<string, string>;
};

const TodoPage = ({}: TodoProps) => {
  const todos = useStore(todosAtom);
  // TODO: Calculate total Resin (amount and days)
  // Tabs to select days
  // Items that do not needs resin (separated by type, and grouped by rarity)
  // Items that needs resin, separated by resin cost, by type, and grouped by rarity

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
          acc[id] = 0;
        }
        acc[id] += data[0];
      }
      return acc;
    }, {});
  }, [todos]);
  const { t } = useIntl();

  const numFormat = Intl.NumberFormat(undefined, { notation: "compact" });
  console.log(todos, summary);
  return (
    <div>
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
      <div className="grid grid-cols-4 gap-3 m-3">
        {todos.map((todo, i) => (
          <div key={todo[0].id + i} className="flex w-full h-full rounded border border-vulcan-900 bg-vulcan-800">
            <div className="flex flex-col w-full relative flex-shrink-0">
              <div className="flex justify-center">
                <p className="text-lg font-semibold text-white">{todo[0].name}</p>
              </div>
              <div className="flex flex-col p-2 flex-grow">
                <div className="flex items-center mb-2">
                  <div className="flex justify-center mx-auto">
                    <div className="w-24 h-24 rounded-md shadow-md overflow-hidden">
                      <img
                        draggable="false"
                        height="128"
                        width="128"
                        loading="lazy"
                        src={getUrl(
                          `/characters/${todo[0].id}/${todo[0].id}_portrait.png`
                        )}
                        alt="Fischl"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col">
                      <div className="flex">
                        <div>
                          <h4 className="w-28 text-sm text-center font-semibold text-white">
                            Levels
                          </h4>
                          <div className="flex justify-center">
                            <div class="ItemPanel_summaryLabel__3Nm32">
                              <p>{todo[2][0]}</p>
                            </div>
                            <div class="ItemPanel_arrows__1biWK">-{">"}</div>
                            <div class="ItemPanel_summaryLabel__3Nm32">
                              <p>{todo[2][1]}</p>
                            </div>
                          </div>
                        </div>
                        <div class="ItemPanel_travelerToggle__3vHMZ"></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h4 className="w-28 text-sm text-center font-semibold text-white">
                        Talents
                      </h4>
                      <div className="flex">
                        <div>
                          <div className="flex">
                            <div className="flex justify-center w-28">
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].aa?.[0]}</p>
                              </div>
                              <div class="ItemPanel_arrows__1biWK">-{">"}</div>
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].aa?.[1]}</p>
                              </div>
                            </div>
                            <div className="text-xs leading-4 text-gray-500 whitespace-nowrap">
                              Attack
                            </div>
                          </div>
                          <div className="flex">
                            <div className="flex justify-center w-28">
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].skill?.[0]}</p>
                              </div>
                              <div class="ItemPanel_arrows__1biWK">-{">"}</div>
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].skill?.[1]}</p>
                              </div>
                            </div>
                            <div className="text-xs leading-4 text-gray-500 whitespace-nowrap">
                              Skill
                            </div>
                          </div>
                          <div className="flex">
                            <div className="flex justify-center w-28">
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].burst?.[0]}</p>
                              </div>
                              <div class="ItemPanel_arrows__1biWK">-{">"}</div>
                              <div class="ItemPanel_summaryLabel__3Nm32">
                                <p>{todo[3].burst?.[1]}</p>
                              </div>
                            </div>
                            <div className="text-xs leading-4 text-gray-500 whitespace-nowrap">
                              Burst
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center flex-wrap">
                  {Object.entries(todo[4]).map(([id, data]) => (
                    <div key={id} className="">
                      <SimpleRarityBox
                        img={getUrl(data[1] as any, 45, 45)}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const genshinData = new GenshinData({ language: localeToLang(locale) });

  return {
    props: { lngDict },
  };
};

export default TodoPage;
