"use client";

import clsx from "clsx";
import { CalculationCharacterResult } from "interfaces/calculator";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { toast } from "sonner";

import Select from "@components/Select";
import SkillLabel from "@components/SkillLabel";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import useLazyFetch from "@hooks/use-lazy-fetch";
import { getLangData } from "@i18n/langData";
import type { Character } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";
import { todos } from "@state/todo";
import { levels } from "@utils/totals";

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
  const t = useTranslations("Genshin.calculator");
  const locale = useLocale();
  const langData = getLangData(locale, "genshin");
  const [calculate, { called, loading, data, error, reset }] =
    useLazyFetch<CalculationCharacterResult>(
      "genshin/calculate_character_level",
    );

  // Reset added to todo state when data changes
  useEffect(() => {
    if (data) {
      setAddedToTodo(false);
    }
  }, [data]);

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

  const validationErrors = useMemo(() => {
    const errors = [];

    if (intendedLevel.lvl < currentLevel.lvl) {
      errors.push(t("intended_level_error"));
    }
    if (intendedTalent1Lvl < currentTalent1Lvl) {
      errors.push(t("intended_talent_error"));
    }

    return errors;
  }, [
    currentLevel.lvl,
    intendedLevel.lvl,
    currentTalent1Lvl,
    intendedTalent1Lvl,
    t,
  ]);

  const addToTodo = useCallback(() => {
    if (!data?.items) {
      toast.error(t("no_data_to_add"));
      return;
    }

    trackClick("calculator_add_character_todo");
    setAddedToTodo(true);
    const resourcesMap = data?.items.reduce(
      (map: any, item: any) => {
        map[item.id] = item.amount;
        return map;
      },
      {} as Record<string, number>,
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

    toast.success(t("added_to_todo_list"));
  }, [
    character.id,
    character.name,
    character.rarity,
    currentLevel.asc,
    currentLevel.lvl,
    currentTalent1Lvl,
    currentTalent2Lvl,
    currentTalent3Lvl,
    data,
    intendedLevel.asc,
    intendedLevel.lvl,
    intendedTalent1Lvl,
    intendedTalent2Lvl,
    intendedTalent3Lvl,
    t,
  ]);

  const numFormat = Intl.NumberFormat();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <span className="my-4 block text-lg font-medium">
          {t("character_level")}
        </span>
        <div className="mb-4">
          <label
            htmlFor="character-select"
            className="mb-2 block text-sm font-medium"
          >
            select_character
          </label>
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
          <span className="mb-2 block text-sm font-medium">
            {t("current_level")}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none focus:ring-2 focus:ring-vulcan-500/50",
                  level.lvl === currentLevel.lvl &&
                    level.asclLvl === currentLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : "",
                )}
                onClick={() => {
                  setCurrentLevel(level);
                  reset();
                  setAddedToTodo(false);
                }}
                aria-label={`${t("level")} ${level.lvl}${level.asc ? "+" : ""}`}
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
          <span className="mb-2 mt-3 block text-sm font-medium">
            {t("intended_level")}
          </span>
          <div className="flex flex-wrap items-center">
            {levels.map((level) => (
              <button
                key={level.lvl + level.asclLvl}
                className={clsx(
                  "m-1 flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-vulcan-400 border-opacity-20 font-semibold leading-none transition duration-100 hover:border-opacity-100 focus:border-vulcan-500 focus:outline-none focus:ring-2 focus:ring-vulcan-500/50",
                  level.lvl === intendedLevel.lvl &&
                    level.asclLvl === intendedLevel.asclLvl
                    ? "border-opacity-100 bg-vulcan-600 text-white"
                    : "",
                  level.lvl < currentLevel.lvl
                    ? "cursor-not-allowed opacity-50"
                    : "",
                )}
                onClick={() => {
                  if (level.lvl >= currentLevel.lvl) {
                    setIntendedLevel(level);
                    reset();
                    setAddedToTodo(false);
                  }
                }}
                disabled={level.lvl < currentLevel.lvl}
                aria-label={`${t("level")} ${level.lvl}${level.asc ? "+" : ""}`}
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
      </div>
      <div>
        <span className="my-4 block text-lg font-medium">
          {t("talents_level")}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="my-2 text-center">
            <SkillLabel
              skill="normal_attack"
              messages={{
                normal_attack: t("normal_attack"),
                skill: t("skill"),
                burst: t("burst"),
              }}
            />
          </div>
          <div className="my-2 text-center">
            <SkillLabel
              skill="skill"
              messages={{
                normal_attack: t("normal_attack"),
                skill: t("skill"),
                burst: t("burst"),
              }}
            />
          </div>
          <div className="my-2 text-center">
            <SkillLabel
              skill="burst"
              messages={{
                normal_attack: t("normal_attack"),
                skill: t("skill"),
                burst: t("burst"),
              }}
            />
          </div>
        </div>
        <div>
          <span className="mb-2 block text-sm font-medium">
            {t("current_level")}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={currentTalent1Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(Number(e.target.value) || 1, 1),
                10,
              );
              setCurrentTalent1Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
            aria-label={t("normal_attack")}
          />
          <Input
            type="number"
            value={currentTalent2Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(Number(e.target.value) || 1, 1),
                10,
              );
              setCurrentTalent2Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
            aria-label={t("skill")}
          />
          <Input
            type="number"
            value={currentTalent3Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(Number(e.target.value) || 1, 1),
                10,
              );
              setCurrentTalent3Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min="1"
            max="10"
            aria-label={t("burst")}
          />
        </div>
        <div>
          <span className="mb-2 mt-3 block text-sm font-medium">
            {t("intended_level")}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={intendedTalent1Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(
                  Number(e.target.value) || currentTalent1Lvl,
                  currentTalent1Lvl,
                ),
                10,
              );
              setIntendedTalent1Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min={currentTalent1Lvl}
            max="10"
            aria-label={t("normal_attack")}
          />
          <Input
            type="number"
            value={intendedTalent2Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(
                  Number(e.target.value) || currentTalent2Lvl,
                  currentTalent2Lvl,
                ),
                10,
              );
              setIntendedTalent2Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min={currentTalent2Lvl}
            max="10"
            aria-label={t("skill")}
          />
          <Input
            type="number"
            value={intendedTalent3Lvl}
            onChange={(e) => {
              const value = Math.min(
                Math.max(
                  Number(e.target.value) || currentTalent3Lvl,
                  currentTalent3Lvl,
                ),
                10,
              );
              setIntendedTalent3Lvl(value);
              reset();
              setAddedToTodo(false);
            }}
            min={currentTalent3Lvl}
            max="10"
            aria-label={t("burst")}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {validationErrors.length > 0 && (
          <div className="mb-4 w-full rounded-md bg-red-500/20 p-3 text-sm text-red-200">
            <ul className="list-inside list-disc">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <Button
            disabled={!canCalculate || loading}
            onClick={() => {
              trackClick("calculate_character");
              calculate({
                characterId: character.id,
                lang: langData,
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
            {loading ? (
              <span className="flex items-center">
                <FaSpinner className="mr-2 animate-spin" />
                {t("calculating")}
              </span>
            ) : (
              t("calculate")
            )}
          </Button>
        </div>
        {error && (
          <div className="mt-4 w-full rounded-md bg-red-500/20 p-4">
            <p className="text-center text-red-200">{t("calculation_error")}</p>
          </div>
        )}
        {called && !loading && data && (
          <div className="w-full lg:w-auto">
            <div className="mt-4 block rounded-lg bg-vulcan-900 p-4 md:inline-block">
              <h3 className="mb-2 text-center text-lg font-medium">
                {t("calculation_result")}
              </h3>
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="pb-2 text-right">{t("amount")}</th>
                    <th className="pb-2 text-left">{t("material")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((res) => (
                    <tr key={res.name}>
                      <td className="border-b border-gray-800 py-1 text-right">
                        <div className="whitespace-no-wrap mr-2 text-white">
                          <span className="mr-2">
                            {numFormat.format(res.amount)}
                          </span>
                          <span>×</span>
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
                          {t("exp_wasted")} {numFormat.format(data.expWasted)}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4 flex justify-center">
                {addedToTodo ? (
                  <div className="inline-flex items-center justify-center p-1 text-green-400">
                    <GiCheckMark className="mr-2" />
                    <span>{t("added_to_todo_list")}</span>
                  </div>
                ) : (
                  <Button onClick={addToTodo}>{t("add_to_todo_list")}</Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
