import Link from "next/link";

import Image from "@components/zenless/Image";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import type { Team } from "@interfaces/zenless/build";
import type { Characters } from "@interfaces/zenless/characters";

type Props = {
  lang: string;
  characterName: string;
  teams: Team[];
  charactersMap: Record<string, Characters>;
  bangboosMap: Record<string, Bangboos>;
};

export default function Teams({
  characterName,
  lang,
  teams,
  bangboosMap,
  charactersMap,
}: Props) {
  return (
    <>
      <h2 className="text-2xl font-semibold">
        {characterName} Best Teams and Bangboo
      </h2>
      <div className="mb-4 flex w-full flex-col gap-2">
        {teams.map((team) => (
          <div
            key={team.name}
            className="flex flex-col gap-2 rounded-lg border-2 border-neutral-600 bg-neutral-900 p-2"
          >
            <h3 className="font-semibold">{team.name}</h3>
            <div className="flex w-full justify-between gap-2 px-2">
              {[1, 2, 3].map((i) => {
                const characterKey = `character_${i}` as
                  | "character_1"
                  | "character_2"
                  | "character_3";
                const teamChar = team[characterKey];
                if (!teamChar) return null;
                if (teamChar.isFlex) {
                  return (
                    <div key={teamChar.name + team.name} className="group flex flex-col items-center justify-center gap-2">
                      <div className="rounded bg-neutral-700 px-2 text-xs text-neutral-200">
                        {teamChar.role}
                      </div>
                      <div className="overflow-hidden rounded-full ring-0 ring-[#fbfe00] transition-all group-hover:ring-4">
                        <div className="h-24 w-24 scale-150 transition-transform ease-in-out group-hover:scale-125">
                          ?
                        </div>
                      </div>
                      <h3 className="w-24 truncate text-center text-sm text-white">
                        {teamChar.name}
                      </h3>
                    </div>
                  );
                }
                const charTeam = charactersMap[teamChar.name];
                if (!charTeam) {
                  console.log("Character not found", characterKey, teamChar);
                  return null;
                }

                return (
                  <Link
                    key={charTeam.id + team.name}
                    href={`/${lang}/zenless/characters/${charTeam.id}`}
                    className="group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="rounded bg-neutral-700 px-2 text-xs text-neutral-200">
                      {teamChar.role}
                    </div>
                    <div className="overflow-hidden rounded-full ring-0 ring-[#fbfe00] transition-all group-hover:ring-4">
                      <Image
                        className="h-24 w-24 scale-150 transition-transform ease-in-out group-hover:scale-125"
                        src={`/characters/portrait_${charTeam.id}_2.webp`}
                        alt={charTeam.name}
                        width={130}
                        height={130}
                      />
                    </div>
                    <h3 className="w-24 truncate text-center text-sm text-white">
                      {charTeam.name}
                    </h3>
                  </Link>
                );
              })}

              <div className="flex max-w-[220px] flex-col">
                <h4 className="text-center font-semibold">Best Bangboos</h4>
                <div className="flex flex-col flex-wrap gap-2 md:flex-row md:items-center md:justify-center">
                  {[...team.bangboos, ...team.alternative_bangboos].map((b) => (
                    <Link
                      key={b + team.name}
                      href={`/${lang}/zenless/bangboos/${b}`}
                      className="group flex flex-col items-center justify-center gap-2"
                    >
                      <div className="overflow-hidden rounded-full ring-0 ring-[#fbfe00] transition-all group-hover:ring-4">
                        <Image
                          className="h-10 w-10 scale-150 transition-transform ease-in-out group-hover:scale-125"
                          src={`/bangboos/${bangboosMap[b]?.icon}.webp`}
                          alt={bangboosMap[b].name}
                          width={90}
                          height={90}
                        />
                      </div>
                      <h3 className="truncate text-center text-sm text-white">
                        {bangboosMap[b].name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <p
              className="mt-2 px-1"
              dangerouslySetInnerHTML={{ __html: team.overview }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
