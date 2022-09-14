import { memo, useMemo, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
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
          "flex flex-col relative justify-start overflow-hidden w-11/12 lg:w-full",
          isOpen ? "h-auto" : "h-30 lg:h-60"
        )}
      >
        <div className="flex flex-col">
          <div className="absolute top-0 pointer-events-none left-0 right-0 bottom-0 flex items-start justify-center overflow-hidden z-0 h-96">
            {isOpen && (
              <img
                className="w-full"
                alt={skill.id}
                src={`${IMGS_CDN}/characters/${characterId}/${skill.id.replace(
                  "normal_attack_",
                  ""
                )}_an.gif`}
              />
            )}
            <div
              className={clsx(
                "absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity",
                isOpen ? "opacity-100" : "opacity-80"
              )}
              style={{
                background: `linear-gradient(rgba(26,28,35,.8),rgb(35, 39, 52) 175px)`,
              }}
            ></div>
          </div>
        </div>
        <div className="flex z-10 items-center text-center p-5 mb-4">
          <div
            className={clsx(
              "flex flex-col flex-grow cursor-pointer transition-transform duration-500 transform -translate-y-6",
              isOpen ? "" : "translate-y-5 lg:translate-y-8"
            )}
            onClick={toggle}
          >
            <div
              className={clsx(
                "text-2xl mt-4 transition-all transform",
                !isOpen
                  ? "translate-y-5 lg:translate-y-16 opacity-0"
                  : "opacity-100 translate-y-0"
              )}
            >
              <MdExpandLess className="m-auto" />
            </div>
            <div className="font-bold text-lg text-white">{skill.name}</div>
            <div
              className="text-xs"
              dangerouslySetInnerHTML={{ __html: skill.info }}
            />
            <div
              className={clsx(
                "text-2xl mt-4 transition-all transform",
                isOpen
                  ? "translate-y-5 lg:translate-y-16 opacity-0"
                  : "opacity-100 translate-y-0"
              )}
            >
              <MdExpandMore className="m-auto" />
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "px-5 text-sm z-10 skill-description transition-opacity",
            isOpen ? "opacity-100" : "opacity-10",
            {
              hidden: !isOpen,
            }
          )}
          dangerouslySetInnerHTML={{ __html: skill.description }}
        />
        <div
          className={clsx(
            "mt-3 z-10 transition-opacity",
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
          className={clsx("w-full mt-3 z-10", {
            hidden: !isOpen,
          })}
        >
          {skill.attributes.map((value, i) => (
            <div
              key={value.label}
              className={clsx({ "bg-vulcan-700": i % 2 === 0 })}
            >
              <div className="flex items-center justify-between px-3 py-1 h-10">
                <p className="text-sm">{value.label}</p>
                <p className="text-sm ml-2">{value.values[level - 1]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default memo(CharacterSkill);
