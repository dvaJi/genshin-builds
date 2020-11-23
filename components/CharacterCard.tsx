import Link from "next/link";
import { memo, ReactNode } from "react";
import { Character } from "../interfaces/character";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link href={`/character/${character.name.replace(/\s/, "")}`}>
      <a>
        <div
          className="h-60 border transition-all relative flex flex-col justify-end text-lg bg-cover bg-no-repeat bg-gray-900 border-gray-900 rounded-md shadow-md hover:shadow-lg hover:border-purple-900"
          style={{
            backgroundImage: `url('/characters/${character.name}.png')`,
          }}
        >
          <div className="p-5 h-full relative flex flex-col justify-end">
            <div className="flex justify-between items-end">
              <div>
                <CharacterInfo
                  icon={
                    <img
                      src="https://cdn.mobalytics.gg/assets/tft/images/synergies/set4/cultist-gold.svg"
                      alt="Cultist"
                      className="w-6 h-6"
                    />
                  }
                >
                  {character.weapon}
                </CharacterInfo>
                <CharacterInfo
                  icon={
                    <img
                      src="https://cdn.mobalytics.gg/assets/tft/images/synergies/set4/vanguard-gold.svg"
                      alt="Vanguard"
                      className="w-6 h-6"
                    />
                  }
                >
                  {character.role}
                </CharacterInfo>
              </div>
              <div className="absolute bottom-5 right-5">
                <img
                  className="w-12"
                  src={`/elements/${character.type}.png`}
                />
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold flex justify-between py-4 px-5 text-white bg-gray-800">
            <span className="p-0 m-0">{character.name}</span>
            <div className="flex items-center">
              <svg
                width="21px"
                height="14px"
                viewBox="0 0 21 14"
                version="1.1"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="mr-4 fill-current text-purple-400"
              >
                <path d="M18.23 13.674c1.898-.423 2.785-3.789 1.963-7.528C19.372 2.407 17.187-.278 15.27.14l-1.283.283c-1.898.423-2.785 3.789-1.964 7.528.822 3.739 3.006 6.424 4.925 6.006l1.282-.283zM2.597 4.865c-.848.397-1.366.898-1.366 1.45-.03 1.308 2.705 2.421 6.106 2.486a13.011 13.011 0 0 0 4.178-.542.43.43 0 0 1 0 .07 7.3 7.3 0 0 0 .371 1.228 14.02 14.02 0 0 1-4.549.597c-1.954-.041-3.711-.403-4.955-.953-.308.274-.48.575-.48.893-.03 1.308 2.705 2.421 6.107 2.486a11.909 11.909 0 0 0 4.759-.76c.223.39.474.764.751 1.118a12.37 12.37 0 0 1-5.51.994c-3.808-.08-6.869-1.377-6.838-2.913v-1.03c.005-.395.219-.767.597-1.1C.96 8.418.49 7.848.5 7.24V6.212c.01-.701.673-1.325 1.748-1.795a1.246 1.246 0 0 1-.165-.607V2.78c0-1.535 3.081-2.778 6.889-2.778 1.28-.011 2.556.143 3.797.457-.15.127-.286.268-.406.423A14.083 14.083 0 0 0 8.972.493C5.57.493 2.815 1.547 2.815 2.85c0 1.302 2.755 2.356 6.157 2.356a15.11 15.11 0 0 0 2.214-.159c-.011.463.004.926.045 1.387-.749.106-1.504.157-2.26.155-2.876 0-5.343-.712-6.373-1.724zM13.72 7.573c-.727-3.336 0-6.334 1.603-6.692 1.603-.358 3.507 2.063 4.248 5.4.741 3.336 0 6.334-1.603 6.692-1.603.358-3.507-2.059-4.238-5.4h-.01z"></path>
              </svg>
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
    <div className="flex items-center mt-2 capitalize text-white">
      <div className="w-9 h-9 flex justify-center items-center rounded-full mr-4 bg-purple-900">
        {icon}
      </div>
      {children}
    </div>
  );
};

export default memo(CharacterCard);
