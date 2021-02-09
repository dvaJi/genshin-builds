import { memo, useState } from "react";
import { useDrop } from "react-dnd";
import { useSetRecoilState } from "recoil";
import { GiSwitchWeapon } from "react-icons/gi";
import Image from "next/image";

import { Character } from "../interfaces/character";
import { Weapon } from "../interfaces/weapon";
import { compBuildState } from "../state/comp-builder-atoms";

interface CharacterBuildWeaponProps {
  weaponSelected: string;
  weaponsList: Record<string, Weapon>;
  character: Character;
  positionKey: string;
}

const CharacterBuildWeapon = ({
  weaponSelected,
  weaponsList,
  character,
  positionKey,
}: CharacterBuildWeaponProps) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: `weapon-${character.weapon}`,
    drop: () => ({
      name: "Weapons",
      position: positionKey,
      characterId: character.id,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveWeapon = () => {
    setCompBuild((currComp) => ({
      ...currComp,
      [positionKey]: { ...currComp[positionKey], w: "" },
    }));
  };

  const isActive = canDrop && isOver;
  let backgroundColor = "";
  let border = "3px solid transparent";
  if (isActive) {
    backgroundColor = "rgba(0, 0, 0, 0.6)";
    border = "3px dashed black";
  } else if (canDrop) {
    backgroundColor = "rgba(0, 0, 0, 0.4)";
    border = "3px dashed black";
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor, border }}
      className="border-vulcan-800 border-4 w-16 h-16 bg-vulcan-900 overflow-hidden relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {weaponSelected ? (
        <div key={weaponSelected}>
          <div className="text-white text-xs absolute right-0 mr-1">
            {isHover && (
              <button
                className="bg-vulcan-400 py-1 px-2 rounded-md"
                onClick={() => handleOnRemoveWeapon()}
              >
                X
              </button>
            )}
          </div>
          <Image
            src={`/_assets/weapons/${weaponsList[weaponSelected].name.replace(
              /\s/g,
              "_"
            )}.png`}
            width={58}
            height={58}
          />
          {/* {weaponsList[weaponSelected].name} */}
        </div>
      ) : (
        <GiSwitchWeapon className="w-3/5 h-3/5 m-3 opacity-30" />
      )}
    </div>
  );
};
export default memo(CharacterBuildWeapon);
