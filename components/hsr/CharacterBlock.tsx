import { memo } from "react";

import type { Character } from "@interfaces/hsr";

import Image from "./Image";

type Props = {
  character: Character;
};

function CharacterBlock({ character }: Props) {
  return (
    <div className="group flex flex-col items-center overflow-hidden border border-border bg-card shadow-sm ring-primary transition-all hover:bg-muted hover:ring-2">
      <Image
        src={`/characters/${character.id}/icon_2.png`}
        alt={character.name}
        width={140}
        height={140}
        loading="lazy"
        className="rounded-full"
      />{" "}
      <span className="font-semibold group-hover:text-accent">
        {character.name}
      </span>{" "}
      <div className="mb-4 flex">
        <Image
          src={`/${character.path.id}.webp`}
          alt={character.path.name}
          width="60"
          height="54"
          loading="lazy"
          className="w-[30px]"
        />
        <Image
          src={`/${character.combat_type.id}.webp`}
          alt={character.combat_type.name}
          width="60"
          height="54"
          loading="lazy"
          className="w-[30px]"
        />
      </div>
    </div>
  );
}

export default memo(CharacterBlock);
