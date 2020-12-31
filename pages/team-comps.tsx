import { useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import Image from "next/image";

import { Artifact } from "../interfaces/artifacts";
import { Character } from "../interfaces/character";
import { ElementalResonance } from "../interfaces/elemental-resonance";
import { Weapon } from "../interfaces/weapon";

import charactersData from "../_content/data/characters.json";
import elementalResonancesData from "../_content/data/elemental_resonance.json";
import recommendedTeams from "../_content/data/teams.json";

import { decodeComp } from "../lib/comp-encoder";
import { RecommendedTeams } from "../interfaces/teams";
import CharacterPortrait from "../components/CharacterPortrait";
import ElementalResonanceCard from "../components/ElementalResonanceCard";

type Props = {
  characters: Record<string, Character>;
  elementalResonances: Record<string, ElementalResonance>;
  teams: RecommendedTeams[];
};

const CompBuilder = ({ characters, teams, elementalResonances }: Props) => {
  return (
    <div>
      <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
        Best Team Comp | Party Building Guide
      </h2>
      <div>
        <p>
          While almost every team can get through most of Genshin Impact's
          content, there are simple team-building rules that will help you
          improve your performance significantly. Source:{" "}
          <a href="https://docs.google.com/spreadsheets/d/1s0G2SDIOp9WB7NRn3ABoRgsS_Qjid46g1-BswFrbTFY">
            Robin's spreadsheet
          </a>
        </p>
        <div>
          <h3 className="my-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Rule #1 - Elemental Reactions
          </h3>
          <p>
            Understanding how elements combine is an essential part of the game.
            As listed on the Elements page, each element will have a different
            reaction when used together. Superconduct, for instance, deals
            damage and reduces the enemy's Physical RES, making it very powerful
            in physical damage teams. Overload and Electro-charged, on the other
            hand, do not have an added effect but deal significantly more
            damage. These are great to use in elemental damage teams.
          </p>
          <h3 className="my-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Rule #2 - Energy Generation
          </h3>
          <p>
            Damaging, defeating, and using Elemental Skill (E) abilities on
            enemies will generate orbs that fuel your characters' energy,
            allowing them to use their Elemental Burst (Q) abilities. Some orbs
            will have an element attached to them and will yield higher energy
            to characters of that same element. As a result, it is recommended
            to have 2 characters, one of them being your primary damage dealer,
            of the same elemental type. This, combined with the bonus you'll
            unlock via the Elemental Resonance system, will increase your team's
            strength.
          </p>
          <h3 className="my-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
            Rule #3 - Roles
          </h3>
          <p>
            We like to divide roles into 3 categories: Main, Support1, Support2,
            Support3.
            <ul>
              <li>
                Main: Most teams are created and designed around a Main DPS.
                Whichever unit you use as your Main DPS doesn't really matter,
                as long as the element is useful against the content you're
                making the team for. In general, Pyro/Electro DPS are the most
                useful when it comes to clearing end-game content, with
                Cryo/Hydro slightly behind them.
              </li>
              <li>
                Support1: Your first support can be considered as somewhat of a
                pair for your Main DPS. They're there to help generate energy
                faster, create Resonance, and to share the benefits of reducing
                elemental RES (notable with Viridiscent Venerer) Some main DPS
                units (Razor) do not require a unit like this to support them as
                they generate enough energy themselves.
              </li>
              <li>
                Support2: Your second support is usually a flex depending on
                your playstyle and which reactions you need/prefer For example,
                Fischl is viable in almost every comp, but if you're playing her
                with pyro DPS, you might find the Overload knockback annoying.
              </li>
              <li>
                Support3: Your third support is usually your anemo unit, who
                will help increase DPS with Viridescent Venerer. If you need
                survivability then Geo with Archaic Petra is OK, however your
                DPS will likely drop by quite a bit Atm, Geo MC &gt; Ning as a
                Geo Support, however new units like Zhongli/Albedo will likely
                fill in that role as well
              </li>
            </ul>
          </p>
        </div>
      </div>
      <div className="">
        <h3 className="my-3 text-xl font-semibold text-gray-700 dark:text-gray-200">
          Recommended Comps
        </h3>
        <div className="flex flex-col m-auto w-full">
          {teams.map((team) => (
            <CompCard
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

interface CompCardProps {
  team: RecommendedTeams;
  elementalResonances: ElementalResonance[];
}

const CompCard = ({ team, elementalResonances }: CompCardProps) => {
  const [comp] = decodeComp(team.code);
  return (
    <div className="block mb-4 relative overflow-hidden">
      <Link href={`/comp-builder?map=${team.code}`}>
        <a
          className="grid grid-cols-3 items-center p-6 border border-gray-700 hover:border-purple-900 hover:shadow-innerCard rounded-md cursor-pointer relative overflow-hidden"
          style={{ minHeight: "10rem" }}
        >
          <div
            className="absolute top-0 left-0 w-full h-full bg-auto bg-no-repeat"
            style={{
              backgroundImage: `url('/characters/${team.characters[0]}_m.png')`,
              backgroundPosition: "left center",
            }}
          />
          <div className="flex items-center justify-between relative">
            <span className="text-xl font-bold">{team.name}</span>
          </div>
          <div className="grid grid-cols-4 overflow-hidden">
            {team.characters.map((character) => (
              <Link href={`/character/${character}`}>
                <a>
                  <CharacterPortrait character={{ name: character }} />
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

export default CompBuilder;
