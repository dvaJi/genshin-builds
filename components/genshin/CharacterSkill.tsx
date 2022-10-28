import { memo, useMemo, useState } from "react";
import clsx from "clsx";

import { useToggle } from "@hooks/use-toggle";

import Crement from "../Crement";
import Card from "../ui/Card";

import { Skill } from "genshin-data/dist/types/character";
import { IMGS_CDN } from "@lib/constants";

type Props = {
  characterId: string;
  skill: Skill;
};

const CharacterSkill = ({ skill, characterId }: Props) => {
  const [level, setLevel] = useState(1);
  const [isOpen, toggle] = useToggle();
  const showCrement = useMemo(() => {
    return (
      skill.attributes[1] &&
      skill.attributes[1].values &&
      skill.attributes[1].values[1]
    );
  }, [skill]);
  return (
    <div className="flex justify-center lg:block">
      <Card
        className={clsx(
          "relative flex w-11/12 flex-col justify-start overflow-hidden  p-0 lg:w-full",
          isOpen
            ? "h-auto bg-opacity-90"
            : "h-30 bg-opacity-50 backdrop-blur-sm lg:h-60"
        )}
      >
        <div className="relative flex h-60 flex-col">
          <div
            onClick={toggle}
            className="absolute top-0 left-0 right-0 bottom-0 z-0 flex cursor-pointer items-start justify-center overflow-hidden"
          >
            <div className="absolute bottom-10 cursor-pointer">
              <img
                className="h-16 select-none opacity-50"
                src={`${IMGS_CDN}/characters/${characterId}/${skill.id.replace(
                  "normal_attack_",
                  ""
                )}.png`}
                alt={skill.name}
              />
            </div>
            {isOpen && (
              <img
                className="w-full select-none"
                alt={skill.id}
                src={`${IMGS_CDN}/characters/${characterId}/${skill.id.replace(
                  "normal_attack_",
                  ""
                )}_an.gif`}
              />
            )}
            <div
              className={clsx(
                "pointer-events-none absolute top-0 left-0 h-full w-full transition-opacity",
                isOpen ? "opacity-100" : "opacity-80"
              )}
              // style={{
              //   background: `linear-gradient(rgba(26,28,35,.8),rgb(35, 39, 52) 175px)`,
              // }}
            ></div>
          </div>
          <div
            className="z-10 flex h-full cursor-pointer p-5 text-center"
            onClick={toggle}
          >
            <div
              className={clsx(
                "flex flex-grow -translate-y-0 scale-110 transform flex-col transition-transform duration-200",
                isOpen ? "" : "translate-y-5 scale-90 lg:translate-y-8"
              )}
            >
              <div className="text-lg font-bold text-white shadow-black text-shadow">
                {skill.name}
              </div>
              <div
                className={clsx(
                  "text-xs shadow-black transition-opacity text-shadow",
                  isOpen ? "opacity-0" : "opacity-100"
                )}
                dangerouslySetInnerHTML={{ __html: skill.info }}
              />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "skill-description z-10 p-5 text-sm transition-opacity",
            isOpen ? "opacity-100" : "opacity-10",
            {
              hidden: !isOpen,
            }
          )}
          dangerouslySetInnerHTML={{ __html: skill.description }}
        />
        <div
          className={clsx(
            "z-10 mt-3 px-4 transition-opacity",
            isOpen ? "opacity-100" : "opacity-10",
            {
              hidden: !isOpen || !showCrement,
            }
          )}
        >
          <Crement
            title="Level"
            currentValue={level}
            setValue={setLevel}
            values={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]}
          />
        </div>
        <div
          className={clsx("z-10 mt-3 w-full px-4", {
            hidden: !isOpen,
          })}
        >
          {skill.attributes.map((value, i) => (
            <div
              key={value.label}
              className={clsx({ "bg-vulcan-700": i % 2 === 0 })}
            >
              <div className="flex h-10 items-center justify-between px-3 py-1">
                <p className="text-sm">{value.label}</p>
                <p className="ml-2 text-sm">{value.values[level - 1]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default memo(CharacterSkill);
