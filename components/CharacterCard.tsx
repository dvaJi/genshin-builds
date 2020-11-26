import Link from "next/link";
import { memo, ReactNode } from "react";
import { GiRoundStar } from "react-icons/gi";

import { Character } from "../interfaces/character";
import RoleIcon from "./RoleIcon";
import WeaponIcon from "./WeaponIcon";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link href={`/character/${character.name.replace(/\s/, "")}`}>
      <a>
        <div className="h-60 transition-all border relative flex flex-col justify-end text-lg bg-no-repeat bg-transparent border-gray-800 rounded-md shadow-md hover:shadow-innerCard hover:border-purple-900">
          <img
            className="absolute"
            src={`/characters/thumbs/${character.name}_thumb_sm.jpg`}
          />
          <div className="p-5 h-full relative flex flex-col justify-end">
            <div className="flex justify-between items-end">
              <div>
                <CharacterInfo
                  icon={
                    <WeaponIcon weapon={character.weapon} className="w-6 h-6" />
                  }
                >
                  {character.weapon}
                </CharacterInfo>
                {character.role && (
                  <CharacterInfo
                    icon={
                      <RoleIcon role={character.role} className="w-6 h-6" />
                    }
                  >
                    {character.role}
                  </CharacterInfo>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <img className="w-12" src={`/elements/${character.type}.png`} />
              </div>
            </div>
          </div>
          <div className="text-xl font-bold flex justify-between py-2 px-4 text-white bg-gray-800 z-20">
            <span className="p-0 m-0">{character.name}</span>
            <div className="flex items-center">
              <GiRoundStar className="mr-4 fill-current text-purple-400" />
              {character.rarity}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
};

const CharacterInfo = ({
  children,
  icon,
}: {
  children: ReactNode;
  icon: ReactNode;
}) => {
  return (
    <div className="flex items-center mt-2 capitalize text-white text-sm pr-4 bg-gray-900 rounded-lg">
      <div className="w-9 h-9 flex justify-center items-center rounded-full mr-2">
        {icon}
      </div>
      {children}
    </div>
  );
};

export default memo(CharacterCard);
