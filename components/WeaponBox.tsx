import { memo } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import ReactTooltip from "react-tooltip";
import { useSetRecoilState } from "recoil";
import Image from "next/image";

import { Weapon } from "../interfaces/weapon";
import { compBuildState } from "../state/comp-builder-atoms";

interface WeaponBoxProps {
  weapon: Weapon;
  isSelected: boolean;
}

const WeaponBox = ({ weapon, isSelected }: WeaponBoxProps) => {
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ isDragging }, drag] = useDrag({
    item: { name: weapon.name, type: `weapon-${weapon.type}` },
    end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(
          `You dropped a weapon: ${item.name} into ${dropResult.name}!`,
          item,
          dropResult
        );
        setCompBuild((currComp) => ({
          ...currComp,
          [dropResult.position]: {
            ...currComp[dropResult.position],
            w: weapon.id,
          },
        }));
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging || isSelected ? 0.4 : 1;
  const pointerEvents = isSelected ? "none" : "initial";
  const weaponName = weapon.name.replace(/\s/g, "_");

  return (
    <>
      <div
        ref={drag}
        style={{ opacity, pointerEvents }}
        className="text-center"
        data-tip
        data-for={weaponName}
      >
        <div className="border-gray-800 border-4 w-16 h-16 m-auto overflow-hidden">
          <Image src={`/weapons/${weaponName}.png`} width={56} height={56} />
        </div>
        <span className="text-gray-500 text-sm">{weapon.name}</span>
      </div>
      <ReactTooltip id={weaponName} type="dark" effect="solid" place="top">
        <div className="flex flex-col">
          <span>
            <b>ATK:</b> {weapon.base}
          </span>
          {weapon.secondary && (
            <span>
              <b>Secondary:</b> {weapon.secondary}
            </span>
          )}
          {weapon.bonus && (
            <div className="max-w-xs">
              <b>{weapon.passive}: </b>
              <span
                className="text-xs "
                dangerouslySetInnerHTML={{ __html: weapon.bonus }}
              />
            </div>
          )}
        </div>
      </ReactTooltip>
    </>
  );
};

export default memo(WeaponBox);
