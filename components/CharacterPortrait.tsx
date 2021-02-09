import { memo } from "react";
import Image from "next/image";
import ElementIcon from "./ElementIcon";

interface CharacterPortraitProps {
  character: {
    id: string;
    name: string;
    element?: string;
    constellation?: number;
  };
}

const CharacterPortrait = ({ character }: CharacterPortraitProps) => {
  return (
    <div className="text-gray-400 cursor-pointer w-32 transition-all duration-200 ease-linear transform hover:scale-105 hover:text-white">
      <div>
        <div className="text-center relative">
          <Image
            className="rounded-full shadow-lg"
            src={`/_assets/characters/${character.id}/${character.id}_portrait.png`}
            width={80}
            height={80}
          />
          {character.element && (
            <div className="absolute top-0 right-5 bg-gray-800 pt-1 px-1 rounded-full">
              <ElementIcon width={20} height={20} type={character.element} />
            </div>
          )}
          {character.constellation !== undefined && (
            <div className="absolute bottom-0 right-2/3 bg-vulcan-700 p-1 rounded-full text-xs font-bold text-gray-300">
              {`C${character.constellation}`}
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-base">{character.name}</p>
    </div>
  );
};

export default memo(CharacterPortrait);
