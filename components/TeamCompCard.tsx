import Link from "next/link";

import CharacterPortrait from "./CharacterPortrait";
import ElementalResonanceCard from "./ElementalResonanceCard";

import { ElementalResonance } from "../interfaces/elemental-resonance";
import { RecommendedTeams } from "../interfaces/teams";
// import { decodeComp } from "../lib/comp-encoder";

interface TeamCompCardProps {
  team: RecommendedTeams;
  elementalResonances: ElementalResonance[];
}

const TeamCompCard = ({ team, elementalResonances }: TeamCompCardProps) => {
  // const [comp] = decodeComp(team.code);
  return (
    <div className="block mb-4 relative overflow-hidden">
      <Link href={`/comp-builder?map=${team.code}`}>
        <a
          className="bg-vulcan-800 grid grid-cols-1 md:grid-cols-3 items-center p-6 border border-vulcan-700 hover:border-purple-900 hover:shadow-innerCard rounded-md cursor-pointer relative overflow-hidden"
          style={{ minHeight: "10rem" }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-auto bg-no-repeat"
            style={{
              backgroundImage: `url('/_assets/characters/${team.characters[0]}_m.png')`,
              backgroundPosition: "-80% 30%",
              filter: "brightness(0.3)",
            }}
          />
          <div className="flex items-center justify-between relative">
            <span className="text-2xl md:text-xl font-bold text-center w-full md:text-left">
              {team.name}
            </span>
          </div>
          <div className="grid grid-cols-4 overflow-hidden">
            {team.characters.map((character) => (
              <Link href={`/character/${character}`}>
                <a>
                  <CharacterPortrait
                    character={{ id: character, name: character }}
                  />
                </a>
              </Link>
            ))}
          </div>
          <div className="inline-flex justify-center w-full">
            {elementalResonances.map((elrs) => (
              <ElementalResonanceCard
                key={elrs?.id}
                elementalResonance={elrs}
              />
            ))}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default TeamCompCard;
