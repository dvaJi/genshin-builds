import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { Character } from "genshin-data";
import { GiCheckMark } from "react-icons/gi";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../Select";
import SkillLabel from "../../src/components/genshin/SkillLabel";

import { getUrl } from "@lib/imgUrl";
import { levels } from "@utils/totals";
import useIntl from "@hooks/use-intl";
import useLazyFetch from "@hooks/use-lazy-fetch";
import { todos } from "@state/todo";
import { CalculationCharacterResult } from "interfaces/calculator";
import { trackClick } from "@lib/gtag";

type Props = {
  characters: Character[];
};

const CharacterCalculator = ({ characters }: Props) => {
  const [character, setCharacter] = useState<Character>(characters[0]);
  const [currentLevel, setCurrentLevel] = useState(levels[0]);
  const [intendedLevel, setIntendedLevel] = useState(levels[13]);
  const [currentTalent1Lvl, setCurrentTalent1Lvl] = useState(1);
  const [currentTalent2Lvl, setCurrentTalent2Lvl] = useState(1);
  const [currentTalent3Lvl, setCurrentTalent3Lvl] = useState(1);
  const [intendedTalent1Lvl, setIntendedTalent1Lvl] = useState(10);
  const [intendedTalent2Lvl, setIntendedTalent2Lvl] = useState(10);
  const [intendedTalent3Lvl, setIntendedTalent3Lvl] = useState(10);
  const [addedToTodo, setAddedToTodo] = useState(false);
  const { t, localeGI } = useIntl("calculator");
  const [calculate, { called, loading, data, reset }] =
    useLazyFetch<CalculationCharacterResult>("calculate_character_level");

  const canCalculate = useMemo(() => {
    const characterIsSelected = !!character;
    const intendedLevelIsAcceptable = intendedLevel.lvl >= currentLevel.lvl;
    const intendedTalent1IsAcceptable = intendedTalent1Lvl >= currentTalent1Lvl;
    const intendedTalent2IsAcceptable = intendedTalent2Lvl >= currentTalent2Lvl;
    const intendedTalent3IsAcceptable = intendedTalent3Lvl >= currentTalent3Lvl;

    return (
      characterIsSelected &&
      intendedLevelIsAcceptable &&
      intendedTalent1IsAcceptable &&
      intendedTalent2IsAcceptable &&
      intendedTalent3IsAcceptable
    );
  }, [
    character,
    currentLevel,
    currentTalent1Lvl,
    currentTalent2Lvl,
    currentTalent3Lvl,
    intendedLevel,
    intendedTalent1Lvl,
    intendedTalent2Lvl,
    intendedTalent3Lvl,
  ]);

  const addToTodo = useCallback(() => {
    trackClick("calculator_add_character_todo");
    setAddedToTodo(true);
    const resourcesMap = data?.items.reduce((map: any, item: any) => {
      map[item.id] = item.amount;
      return map;
    }, {} as Record<string, number>);

    todos.set([
      ...(todos.get() || []),
      [
        { id: character.id, name: character.name, r: character.rarity },
        "character",
        [
          currentLevel.lvl,
          currentLevel.asc,
          intendedLevel.lvl,
          intendedLevel.asc,
        ],
        {
          normal_attack: [currentTalent1Lvl, intendedTalent1Lvl],
          skill: [currentTalent2Lvl, intendedTalent2Lvl],
          burst: [currentTalent3Lvl, intendedTalent3Lvl],
        },
        resourcesMap,
        resourcesMap,
      ],
    ]);
  }, [
    character.id,
    character.name,
    character.rarity,
    currentLevel.asc,
    currentLevel.lvl,
    currentTalent1Lvl,
    currentTalent2Lvl,
    currentTalent3Lvl,
    data?.items,
    intendedLevel.asc,
    intendedLevel.lvl,
    intendedTalent1Lvl,
    intendedTalent2Lvl,
    intendedTalent3Lvl,
  ]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div>
        <span className="text-lg my-4">
          {t({ id: "character_level", defaultMessage: "Character Level" })}
        </span>
        <div>
          <Select
            options={characters.map((c) => ({ id: c.id, name: c.name }))}
            onChange={(option) => {
              setCharacter(characters.find((c) => c.id === option.id)!!);
              reset();
              setAddedToTodo(false);
            }}
            selectedIconRender={(selected) => (
              <img
                className="w-6 h-6 mr-2"
                src={getUrl(
                  `/characters/${selected.id}/${selected.id}_portrait.png`,
                  32,
                  32
                )}
                alt={selected.name}
              />
            )}
            itemsListRender={(option) => (
              <>
                <img
                  className="w-6 h-6 mr-3"
                  src={getUrl(
                    `/characters/${option.id}/${option.id}_portrait.png`,
                    32,
                    32
                  )}
                  alt={option.name}
                />
                <span className="flex-1 text-base">{option.name}</span>
              </>
            )}
          />
        </div>
        <div className="mt-4">
          <span>
            {t({ id: "current_level", defaultMessage: "Current Level" })}
          </span>
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "flex items-center justify-center font-semibold rounded-full w-10 h-10 m-1 leading-none flex-col transition duration-100 border-2 border-vulcan-400 border-opacity-20 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "text-white border-opacity-100 bg-vulcan-600"
                    : ""
                )}
                onClick={() => {
                  setCurrentLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
              >
                <div className="">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
                  className={clsx("w-4", {
                    "opacity-100": level.asc,
                    "opacity-25": !level.asc,
                  })}
                  alt="ascension"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <span>
            {t({ id: "intended_level", defaultMessage: "Intended Level" })}
          </span>
          <div className="flex items-center flex-wrap">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "flex items-center justify-center font-semibold rounded-full w-10 h-10 m-1 leading-none flex-col transition duration-100 border-2 border-vulcan-400 border-opacity-20 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "text-white border-opacity-100 bg-vulcan-600"
                    : ""
                )}
                onClick={() => {
                  setIntendedLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
              >
                <div className="">{level.lvl}</div>
                <img
                  src={getUrl(`/ascension.png`, 16, 16)}
                  className={clsx("w-4", {
                    "opacity-100": level.asc,
                    "opacity-25": !level.asc,
                  })}
                  alt="ascension"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div>
        <span className="text-lg my-4">
          {t({ id: "talents_level", defaultMessage: "Talents Level" })}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="my-2 text-center">
            <SkillLabel skill="normal_attack" />
          </div>
          <div className="my-2 text-center">
            <SkillLabel skill="skill" />
          </div>
          <div className="my-2 text-center">
            <SkillLabel skill="burst" />
          </div>
        </div>
        <div>{t({ id: "current_level", defaultMessage: "Current Level" })}</div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={currentTalent1Lvl}
            onChange={(e) => {
              setCurrentTalent1Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={currentTalent2Lvl}
            onChange={(e) => {
              setCurrentTalent2Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={currentTalent3Lvl}
            onChange={(e) => {
              setCurrentTalent3Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
        </div>
        <div>
          {t({ id: "intended_level", defaultMessage: "Intended Level" })}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={intendedTalent1Lvl}
            onChange={(e) => {
              setIntendedTalent1Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={intendedTalent2Lvl}
            onChange={(e) => {
              setIntendedTalent2Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
          <Input
            type="number"
            value={intendedTalent3Lvl}
            onChange={(e) => {
              setIntendedTalent3Lvl(Number(e.target.value));
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div>
          <Button
            disabled={!canCalculate}
            onClick={() => {
              trackClick("calculate_character");
              calculate({
                characterId: character.id,
                lang: localeGI,
                params: {
                  currentLevel,
                  intendedLevel,
                  currentTalentLvl: {
                    aa: currentTalent1Lvl,
                    skill: currentTalent2Lvl,
                    burst: currentTalent3Lvl,
                  },
                  intendedTalentLvl: {
                    aa: intendedTalent1Lvl,
                    skill: intendedTalent2Lvl,
                    burst: intendedTalent3Lvl,
                  },
                },
              });
            }}
          >
            {t({ id: "calculate", defaultMessage: "Calculate" })}
          </Button>
        </div>
        {called && !loading && data && (
          <div className="w-full lg:w-auto">
            <div className="bg-vulcan-900 rounded-lg p-4 mt-2 block md:inline-block">
              <table>
                <tbody>
                  {data.items.map((res) => (
                    <tr key={res.name}>
                      <td className="text-right border-b border-gray-800 py-1">
                        <div className="text-white mr-2 whitespace-no-wrap">
                          <span className="mr-2">
                            {numFormat.format(res.amount)}
                          </span>
                          <span>x</span>
                        </div>
                      </td>
                      <td className="border-b border-gray-800 py-1">
                        <span className="text-white">
                          <span className="w-7 inline-block">
                            <img
                              className="h-7 inline-block mr-1"
                              src={getUrl(res.img, 32, 32)}
                              alt={res.name}
                            />
                          </span>
                          {res.name}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.expWasted < 0 && (
                    <tr>
                      <td colSpan={2} className="text-center">
                        <span className="text-center italic text-pink-900">
                          {t({
                            id: "exp_wasted",
                            defaultMessage: "EXP Wasted",
                          })}{" "}
                          {numFormat.format(data.expWasted)}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-center mt-2">
                {addedToTodo ? (
                  <div className="inline-flex p-1 justify-center content-center">
                    <GiCheckMark className="mr-2" />
                    <span>
                      {t({
                        id: "added_to_todo_list",
                        defaultMessage: "Added to Todo List",
                      })}
                    </span>
                  </div>
                ) : (
                  <Button onClick={addToTodo}>
                    {t({
                      id: "add_to_todo_list",
                      defaultMessage: "Add to Todo List",
                    })}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCalculator;
