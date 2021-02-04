import { GetStaticProps } from "next";

import TeamCompExplanation from "../components/TeamCompExplanation";
import TeamCompCard from "../components/TeamCompCard";

import { Character } from "../interfaces/character";
import { ElementalResonance } from "../interfaces/elemental-resonance";
import { RecommendedTeams } from "../interfaces/teams";

import charactersData from "../_content/data/characters.json";
import elementalResonancesData from "../_content/data/elemental_resonance.json";
import recommendedTeams from "../_content/data/teams.json";

type Props = {
  characters: Record<string, Character>;
  elementalResonances: Record<string, ElementalResonance>;
  teams: RecommendedTeams[];
};

const TierList = ({ teams, elementalResonances }: Props) => {
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        Best Team Comp | Party Building Guide
      </h2>
      <TeamCompExplanation />
      <div className="">
        <h3 className="my-3 text-xl font-semibold text-gray-200">
          Recommended Comps
        </h3>
        <div className="flex flex-col m-auto w-full">
          {teams.map((team) => (
            <TeamCompCard
              key={team.code}
              team={team}
              elementalResonances={team.elemental_resonances.map(
                (id) => elementalResonances[id]
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const characters = (charactersData as Character[]).reduce<
    Record<string, Character>
  >((acc, val) => Object.assign(acc, { [val.id]: val }), {});
  const elementalResonances = (elementalResonancesData as ElementalResonance[]).reduce<
    Record<string, Character>
  >((acc, val) => Object.assign(acc, { [val.id]: val }), {});
  const teams = recommendedTeams as RecommendedTeams[];
  return {
    props: {
      characters,
      elementalResonances,
      teams,
    },
    revalidate: 1,
  };
};

export default TierList;
