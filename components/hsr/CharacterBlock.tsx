import { getHsrUrl } from "@lib/imgUrl";
import type { Character } from "hsr-data";
import { memo } from "react";

type Props = {
  character: Character;
};

function CharacterBlock({ character }: Props) {
  return (
    <div className="group flex flex-col items-center overflow-hidden bg-hsr-surface2 shadow-sm transition-all hover:bg-hsr-surface3">
      <img
        src={getHsrUrl(`/characters/${character.id}/icon.png`, 140, 140)}
        alt={character.name}
        width="128"
        height="128"
        loading="lazy"
        className="rounded-full"
      />{" "}
      <span className="font-semibold group-hover:text-hsr-accent">
        {character.name}
      </span>{" "}
      <div className="mb-4 flex">
        <img
          src={getHsrUrl(`/${character.path.id}.webp`)}
          alt={character.path.name}
          width="60"
          height="54"
          style={{ width: 30 }}
          loading="lazy"
          className="w-[30px]"
        />
        <img
          src={getHsrUrl(`/${character.combat_type.id}.webp`)}
          alt={character.combat_type.name}
          width="60"
          height="54"
          style={{ width: 30 }}
          loading="lazy"
          className="w-[30px]"
        />
      </div>
    </div>
  );
}

export default memo(CharacterBlock);
