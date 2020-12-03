import { memo, useState } from "react";
import { motion } from "framer-motion";

import CharacterBuildWeapon from "./CharacterBuildWeapon";
import CharacterBuildArtifacts from "./CharacterBuildArtifacts";

import { Character } from "../interfaces/character";
import { ElementalResonance } from "../interfaces/elemental-resonance";
import { Weapon } from "../interfaces/weapon";
import { CharacterBuild } from "../state/comp-builder-atoms";
import { Artifact } from "../interfaces/artifacts";

const elResonanceColor = (er: ElementalResonance | undefined) => {
  if (!er) {
    return "initial";
  }

  let color = "";
  switch (er.id) {
    case "1":
      // Geo
      color = "#F59E0B";
      break;

    case "2":
      // Pyro
      color = "#DC2626";
      break;

    case "3":
      // Hydro
      color = "#08e3fe";
      break;
    case "4":
      // Anemo
      color = "#92dbb8";
      break;
    case "5":
      // Electro
      color = "#debaff";
      break;
    case "6":
      // Hydro
      color = "#a5e8ec";
      break;

    default:
      color = "#283246";
      break;
  }

  return `0 0 10px ${color}`;
};

interface CharacterBuildCardProps {
  character: Character;
  elementalResonance: ElementalResonance | undefined;
  teamBuild: Record<string, CharacterBuild>;
  weaponsList: Record<string, Weapon>;
  artifactsList: Record<string, Artifact>;
  positionKey: string;
  isActive: boolean;
  onRemoveCharacter: () => void;
}

const CharacterBuildCard = ({
  character,
  elementalResonance,
  teamBuild,
  weaponsList,
  artifactsList,
  positionKey,
  isActive,
  onRemoveCharacter,
}: CharacterBuildCardProps) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className="md:h-500px h-24 mx-1 border-gray-400 dark:border-gray-800 border-4 relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundImage: `url('/regions/${character.region}_d.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: elResonanceColor(elementalResonance),
      }}
    >
      <div
        className="p-3 min-h-full min-w-full transition-all"
        style={{
          backgroundImage: `url('/characters/${character.name}_m.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: isActive ? 0.5 : 1,
        }}
      >
        <div className="text-white absolute right-0 mr-3">
          {isHover && (
            <motion.button
              initial={{ scale: 0.2, opacity: 0.1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-vulcan-400 py-1 px-2 rounded-md"
              onClick={onRemoveCharacter}
            >
              X
            </motion.button>
          )}
        </div>
        <span
          className="text-gray-100 font-bold text-3xl tracking-tighter uppercase inline-block"
          style={{ textShadow: "0px 0px 8px black" }}
        >
          <span>{character.name}</span>
          <img
            className="inline ml-3 align-baseline"
            src={`/elements/${character.type}.png`}
            height={20}
            width={20}
          />
        </span>
        <div className="mt-2">
          <CharacterBuildWeapon
            weaponSelected={teamBuild[positionKey].w}
            weaponsList={weaponsList}
            character={character}
            positionKey={positionKey}
          />
        </div>
        <div className="mt-2">
          <CharacterBuildArtifacts
            artifactSelected={teamBuild[positionKey].a}
            artifactsList={artifactsList}
            character={character}
            positionKey={positionKey}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterBuildCard);
