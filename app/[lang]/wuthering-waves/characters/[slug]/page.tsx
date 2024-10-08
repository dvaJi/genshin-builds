import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import ElementIcon from "@components/wuthering-waves/ElementIcon";
import Image from "@components/wuthering-waves/Image";
import TypeIcon from "@components/wuthering-waves/TypeIcon";
import { i18n } from "@i18n-config";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { rarityToString } from "@utils/rarity";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const _characters = await getWWData<Characters[]>({
      resource: "characters",
      language: lang,
      select: ["id", "name", "rarity"],
    });

    if (!_characters) continue;

    routes.push(
      ..._characters.map((c) => ({
        lang,
        slug: c.id,
      }))
    );
  }

  return routes;
}

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const character = await getWWData<Characters>({
    resource: "characters",
    language: params.lang,
    filter: {
      id: params.slug,
    },
  });

  if (!character) {
    return;
  }

  const title = `Wuthering Waves (WuWa) ${character.name} | Builds and Team`;
  const description = `${character.name} is an ${rarityToString(character.rarity)} character in Wuthering Waves (WuWa). This page is going to provide you with the best builds and team for ${character.name}.`;

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/characters/${params.slug}`,
    locale: params.lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const character = await getWWData<Characters>({
    resource: "characters",
    language: params.lang,
    filter: {
      id: params.slug,
    },
  });

  if (!character) {
    return notFound();
  }

  const characters = await getWWData<Characters[]>({
    resource: "characters",
    language: params.lang,
    select: ["id", "name", "rarity"],
  });

  const charactersTeam = character.teams.reduce(
    (acc, c) => {
      const [char] = c.split("~");
      const ch = characters?.find((c) => c.name === char)!;
      if (!acc[char]) {
        acc[char] = ch;
      }
      return acc;
    },
    {} as Record<string, Characters>
  );

  return (
    <div className="relative">
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="absolute -top-20 right-10 -z-10">
          <Image
            className="select-none opacity-50 blur-[1px] md:opacity-70 md:blur-0 lg:opacity-100"
            src={`/characters/portrait_${character.id}.webp`}
            alt={character.name}
            width={350}
            height={350}
          />
        </div>
        <div className="flex gap-4 px-2 lg:px-0">
          <div
            className={`flex-shrink-0 flex-grow-0 rarity-${character.rarity} h-[140px] w-[140px] overflow-hidden rounded-lg`}
          >
            <Image
              src={`/characters/thumb_${character.id}.webp`}
              alt={character.name}
              width={140}
              height={140}
            />
          </div>
          {/* <div
            className={`h-[220px] w-auto md:h-[320px] rarity-${character.rarity} overflow-hidden rounded-lg`}
          >
            <Image
              className="-translate-y-8 md:-translate-y-12"
              src={`/characters/portrait_${character.id}.webp`}
              alt={character.name}
              width={300}
              height={380}
            />
          </div> */}
          <div className="">
            <h1 className="mb-2 text-3xl text-white">
              Wuthering Waves {character.name} Build
            </h1>
            <div className="flex flex-col items-baseline gap-2">
              <div className="flex items-center gap-3 rounded bg-ww-900 px-2 py-1 pr-4 text-ww-50">
                <ElementIcon
                  type={character.element[0]}
                  width={30}
                  height={30}
                />{" "}
                {character.element[0]}
              </div>
              <div className="flex items-center gap-3 rounded bg-ww-900 px-2 py-1 pr-4 text-ww-50">
                <TypeIcon type={character.type[0]} width={30} height={30} />
                {character.type}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Upgrade Materials
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
        {character.materials.map((mat) => (
          <div
            key={mat}
            className="flex items-center gap-2 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
          >
            <Image
              src={`/mats/${mat.replace(/ /g, "-")}.webp`}
              alt={mat}
              width={40}
              height={40}
            />
            <div>{mat}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 md:gap-4">
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Sets
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.sets.map((set) => {
              const [name, pieces] = set.split("~");
              return (
                <div
                  key={set}
                  className="flex items-center gap-2 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
                >
                  <Image
                    src={`/icons/element_${name.replace(/ /g, "-")}.webp`}
                    alt={name}
                    width={40}
                    height={40}
                  />
                  <div className="rounded-md bg-ww-900 p-2 text-xs">
                    {pieces}
                  </div>
                  {name}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Primary Echo
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.primary_echo.map((echo) => (
              <div
                key={echo}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
              >
                <Image
                  src={`/echoes/${echo.replace(/ /g, "_").toLowerCase().replace("é", "e")}.webp`}
                  alt={echo}
                  width={40}
                  height={40}
                />
                <div>{echo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-4">
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Stats
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.echoes.map((stat, i) => (
              <div
                key={stat}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-2"
              >
                {i === 0 ? "4 Cost: " : ""}
                {i === 1 ? "3 Cost: " : ""}
                {i === 2 ? "1 Cost: " : ""}
                {stat}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Substats
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-col gap-2 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.substats.map((substat, i) => (
              <div
                key={substat}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
              >
                <div className="rounded-md bg-ww-900 p-2 text-xs">{i + 1}</div>
                {substat}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Best Weapons
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex flex-wrap gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
        {character.weapons.map((weapon) => (
          <div
            key={weapon}
            className="flex items-center gap-4 rounded-md bg-ww-900 px-3 py-1"
          >
            <Image
              src={`/weapons/${weapon.replace(/\#/g, "-").replace(/ /g, "_").toLowerCase()}.webp`}
              alt={weapon}
              width={40}
              height={40}
            />
            {weapon}
          </div>
        ))}
      </div>

      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Best {character.name} Team
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.teams.map((team) => {
          const [character, role] = team.split("~");
          const char = charactersTeam[character];
          return (
            <Link
              key={team}
              href={`/${params.lang}/wuthering-waves/characters/${char.id}`}
              className="mb-6 flex flex-col items-center"
              prefetch={false}
            >
              <div
                className={`overflow-hidden rounded transition-all rarity-${char.rarity} ring-0 ring-ww-800 group-hover:ring-4`}
              >
                <Image
                  className="transition-transform ease-in-out group-hover:scale-110"
                  src={`/characters/thumb_${char.id}.webp`}
                  alt={char.name}
                  width={124}
                  height={124}
                />
              </div>
              <h3>{character}</h3>
              <div className="text-sm text-ww-300">{role}</div>
            </Link>
          );
        })}
      </div>
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Active Skills
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.skills.map((skill) => (
          <div key={skill.name} className="mb-6 flex gap-4 last:mb-0">
            <Image
              className="h-20 w-20 rounded-full border border-ww-900 bg-ww-950"
              src={`/characters/icon_${character.id}_${skill.icon}.webp`}
              alt={skill.name}
              width={80}
              height={80}
            />
            <div className="p-1">
              <h3 className="text-ww-50">{skill.name}</h3>
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: skill.description.replace(/\\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Passive Skills
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.passives.map((skill) => (
          <div key={skill.name} className="mb-6 flex gap-4 last:mb-0">
            <Image
              className="h-20 w-20 rounded-full border border-ww-900 bg-ww-950"
              src={`/characters/icon_${character.id}_${skill.icon}.webp`}
              alt={skill.name}
              width={80}
              height={80}
            />
            <div className="p-1">
              <h3 className="text-ww-50">{skill.name}</h3>
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: skill.description.replace(/\\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Swap Skills
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.swap.map((skill) => (
          <div key={skill.name} className="mb-6 flex gap-4 last:mb-0">
            <Image
              className="h-20 w-20 rounded-full border border-ww-900 bg-ww-950"
              src={`/characters/icon_${character.id}_${skill.icon}.webp`}
              alt={skill.name}
              width={80}
              height={80}
            />
            <div className="p-1">
              <h3 className="text-ww-50">{skill.name}</h3>
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: skill.description.replace(/\\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Resonance Chain
      </h2>
      <div className="mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.chain.map((skill) => (
          <div key={skill.name} className="mb-6 flex gap-4 last:mb-0">
            <Image
              className="h-20 w-20 rounded-full border border-ww-900 bg-ww-950"
              src={`/characters/icon_${character.id}_${skill.icon}.webp`}
              alt={skill.name}
              width={80}
              height={80}
            />
            <div className="p-1">
              <h3 className="text-ww-50">{skill.name}</h3>
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: skill.description.replace(/\\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
