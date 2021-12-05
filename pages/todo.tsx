import { GetStaticProps } from "next";
import { useStore } from "@nanostores/react";
import GenshinData, { Character } from "genshin-data";

import Ads from "@components/Ads";
import TeamCard from "@components/TeamCard";
import Metadata from "@components/Metadata";

import { todos as todosAtom } from "../state/todo";

import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { Team, TeamFull } from "interfaces/teams";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import Button from "@components/Button";
import { useMemo } from "react";

type TodoProps = {
  teams: TeamFull[];
  common: Record<string, string>;
};

const TodoPage = ({ teams }: TodoProps) => {
  const todos = useStore(todosAtom);
  // const summary = useMemo<any>(() => {
  //   return todos.reduce((acc, value) => {
  //     for (const [id, amount] of Object.entries(value.resources)) {
  //       if (!isSunday && itemList[id].day && itemList[id].day.includes(today)) {
  //         if (todayOnly[id] === undefined) {
  //           todayOnly[id] = 0;
  //         }
  //         todayOnly[id] += amount;
  //       }
  //       if (acc[id] === undefined) {
  //         acc[id] = 0;
  //       }
  //       acc[id] += amount;
  //     }
  //     return acc;
  //   }, {});
  // }, [todos]);
  const { t } = useIntl();

  const numFormat = Intl.NumberFormat();
  console.log(todos, todos[0]);
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
      <div className="">
        {todos.map((todo, i) => (
          <div key={todo[0].id + i} class="bg-item rounded-xl p-4 text-white">
            <div class="flex items-center mb-2">
              {todo[1] === "weapon" && (
                <>
                  <img
                    class="h-8 inline-block mr-2"
                    src={`/images/weapons/${todo[0].id}.png`}
                    alt={todo[0].name}
                  />
                  <div class="flex-1">
                    <p class="font-bold">{todo[0].name}</p>
                    <p class="text-gray-500">
                      Level {`${todo[2][0]}-${todo[2][1]}`}
                    </p>
                  </div>
                </>
              )}
              {todo[1] === "character" && (
                <>
                  <img
                    class="h-8 inline-block mr-2"
                    src={`/characters/${todo[0].id}.png`}
                    alt={todo[0].name}
                  />
                  <div class="flex-1">
                    <p class="font-bold">{todo[0].name}</p>
                    <p class="text-gray-500">
                      Level {`${todo[2][0]}-${todo[2][1]}`}
                    </p>
                  </div>
                </>
              )}
              <Button
                disabled={i === 0}
                onClick={() => console.log("reorder(i, -1)")}
                className="rounded-l-xl"
              >
                L
              </Button>
              <Button
                disabled={i === todos.length - 1}
                onClick={() => console.log("reorder(i, 1)")}
                className="rounded-r-xl"
              >
                R
              </Button>
              <table class="w-full">
                {Object.entries(todo[4])
                  .sort((a: any, b: any) => b[1] - a[1])
                  .map(([id, amount]) => (
                    <tr key={id + amount}>
                      <td class="text-right border-b border-gray-700 py-1">
                        <span
                          className={`${
                            amount === 0
                              ? "line-through text-gray-600"
                              : "text-white"
                          } mr-2 whitespace-no-wrap`}
                        >
                          {numFormat.format(amount)}X
                        </span>
                      </td>
                      <td class="border-b border-gray-700 py-1">
                        <span
                          className={
                            amount === 0
                              ? "line-through text-gray-600"
                              : "text-white"
                          }
                        >
                          <span class="w-6 inline-block">
                            <img
                              class="h-6 inline-block mr-1"
                              src={`/images/items/${id}.png`}
                              alt={id}
                            />
                          </span>
                          {id}
                        </span>
                      </td>
                    </tr>
                  ))}
              </table>
              <div class="flex mt-2 items-end">
                <p class="flex-1 text-gray-400"># {i + 1}</p>
                <Button
                  onClick={() => console.log("askDeleteTodo(i)")}
                  className="px-2"
                >
                  RM Delete
                </Button>
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
  const teams = require(`../_content/data/teams.json`) as Team[];

  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = (
    await genshinData.characters({
      select: ["id", "name", "element"],
    })
  ).reduce<Record<string, Character>>((map, val) => {
    map[val.id] = val;
    return map;
  }, {});

  const teamsf: TeamFull[] = teams.map((team) => {
    return {
      primary: team.primary.map((prim) => ({
        character: characters[prim.characterId],
        role: prim.role,
      })),
      alternatives: team.alternatives.map((alt) => ({
        characters: alt.characters.map((c) => characters[c]),
        substitutes: alt.substitutes.map((c) => characters[c]),
      })),
    };
  });

  return {
    props: { teams: teamsf, lngDict },
  };
};

export default TodoPage;
