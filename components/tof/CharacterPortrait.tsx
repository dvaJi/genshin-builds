import { memo } from "react";
import { Character } from "@dvaji/tof-builds";
import TypeIcon from "./TypeIcon";
import { getTofUrl } from "@lib/imgUrl";

interface CharacterPortraitProps {
  character: Character;
}

const CharacterPortrait = ({ character }: CharacterPortraitProps) => {
  return (
    <div className="group relative flex w-full flex-col items-center justify-center rounded-lg p-4 hover:bg-tof-600">
      <div className="h-24 w-24 overflow-hidden rounded-full ring-0 transition-shadow duration-200 ease-in-out group-hover:ring-4 group-hover:ring-slate-50">
        <img
          className="scale-125 transition-transform group-hover:scale-150"
          src={getTofUrl(`/characters/${character.id}.png`, 126, 126)}
          alt={character.name}
        />
      </div>
      <img
        src={getTofUrl(`/weapons/${character.weapon_id}.png`, 86, 86)}
        className="absolute top-16 left-8 h-14 w-14 transition-transform group-hover:translate-y-5 group-hover:-translate-x-8 group-hover:scale-150 md:left-10 lg:top-12 lg:left-16 xl:left-20"
        alt={character.weapon}
        loading="lazy"
      />
      <TypeIcon
        type={character.element}
        className="absolute top-4 right-12 h-6 w-6 transition-transform group-hover:translate-x-3 md:right-14 lg:top-5 lg:right-16 xl:right-24"
      />
      <TypeIcon
        type={character.resonance}
        className="absolute top-10 right-12 h-6 w-6 transition-transform group-hover:translate-y-3 group-hover:translate-x-3 md:right-14 lg:top-11 lg:right-16 xl:right-24"
      />
      <h2 className="mt-2 text-lg text-tof-50">{character.name}</h2>
      <h3 className="text-xs">{character.weapon}</h3>
    </div>
  );
};

export default memo(CharacterPortrait);
