import type { Characters } from "@interfaces/tof/characters";

import Image from "./Image";

interface CharacterPortraitProps {
  character: Characters;
}

const CharacterPortrait = ({ character }: CharacterPortraitProps) => {
  return (
    <div className="group relative flex w-full flex-col items-center justify-center rounded-lg p-4 hover:bg-tof-600">
      <div className="h-24 w-24 overflow-hidden rounded-full ring-0 transition-shadow duration-200 ease-in-out group-hover:ring-4 group-hover:ring-slate-50">
        <Image
          className="scale-125 transition-transform group-hover:scale-150"
          src={`/characters/portrait_${character.id}.png`}
          alt={character.name}
          width={126}
          height={126}
        />
      </div>
      <Image
        src={`/weapons/icon_${character.weaponId}.png`}
        className="absolute left-8 top-16 h-14 w-14 rounded-full transition-transform group-hover:bg-vulcan-800/70 md:left-10 lg:left-16 lg:top-12 xl:left-20"
        alt={character.weaponId}
        width={86}
        height={86}
      />
      {/* <TypeIcon
        type={character.element}
        className="absolute right-12 top-4 h-6 w-6 transition-transform group-hover:translate-x-3 md:right-14 lg:right-16 lg:top-5 xl:right-24"
      />
      <TypeIcon
        type={character.resonance}
        className="absolute right-12 top-10 h-6 w-6 transition-transform group-hover:translate-x-3 group-hover:translate-y-3 md:right-14 lg:right-16 lg:top-11 xl:right-24"
      />
      
      <h3 className="text-xs">{character.weapon}</h3> */}
      <h2 className="mt-2 text-lg text-tof-50">{character.name}</h2>
    </div>
  );
};

export default CharacterPortrait;
