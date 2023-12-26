"use client";

import type { Character } from "@interfaces/genshin";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { GiCheckMark } from "react-icons/gi";

import Select from "@components/Select";
import SkillLabel from "@components/SkillLabel";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

import useIntl from "@hooks/use-intl";
import useLazyFetch from "@hooks/use-lazy-fetch";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";
import { todos } from "@state/todo";
import { levels } from "@utils/totals";
import { CalculationCharacterResult } from "interfaces/calculator";

type Props = {
  characters: Character[];
};

export function CharacterCalculator({ characters }: Props) {
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
    useLazyFetch<CalculationCharacterResult>(
      "genshin/calculate_character_level"
    );

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
    const resourcesMap = data?.items.reduce(
      (map: any, item: any) => {
        map[item.id] = item.amount;
        return map;
      },
      {} as Record<string, number>
    );

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <span className="my-4 text-lg">
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
                className="mr-2 h-6 w-6"
                src={getUrl(`/characters/${selected.id}/image.png`, 32, 32)}
                alt={selected.name}
              />
            )}
            itemsListRender={(option) => (
              <>
                <img
                  className="mr-3 h-6 w-6"
                  src={getUrl(`/characters/${option.id}/image.png`, 32, 32)}
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
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
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
                  width={16}
                  height={16}
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
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
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
        <span className="my-4 text-lg">
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
            <div className="mt-2 block rounded-lg bg-vulcan-900 p-4 md:inline-block">
              <table>
                <tbody>
                  {data.items.map((res) => (
                    <tr key={res.name}>
                      <td className="border-b border-gray-800 py-1 text-right">
                        <div className="whitespace-no-wrap mr-2 text-white">
                          <span className="mr-2">
                            {numFormat.format(res.amount)}
                          </span>
                          <span>x</span>
                        </div>
                      </td>
                      <td className="border-b border-gray-800 py-1">
                        <span className="text-white">
                          <span className="inline-block w-7">
                            <img
                              className="mr-1 inline-block h-7"
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
              <div className="mt-2 flex justify-center">
                {addedToTodo ? (
                  <div className="inline-flex content-center justify-center p-1">
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
}
