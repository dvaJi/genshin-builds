import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import ElementIcon from "@components/wuthering-waves/ElementIcon";
import Image from "@components/wuthering-waves/Image";
import TypeIcon from "@components/wuthering-waves/TypeIcon";
import { i18n } from "@i18n-config";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
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
    const _characters = await getRemoteData<Characters[]>(
      "wuthering",
      "characters"
    );

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
  const characters = await getRemoteData<Characters[]>(
    "wuthering",
    "characters"
  );
  const character = characters.find((c) => c.id === params.slug);

  if (!character) {
    return;
  }

  const title = `Wuthering Waves ${character.name} | Builds and Team`;
  const description = `${character.name} is an ${rarityToString(character.rarity)} character in Wuthering Waves. This page is going to provide you with the best builds and team for ${character.name}.`;

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/characters/${params.slug}`,
    locale: params.lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const characters = await getRemoteData<Characters[]>(
    "wuthering",
    "characters"
  );
  const character = characters.find((c) => c.id === params.slug);

  if (!character) {
    return notFound();
  }

  return (
    <div className="relative">
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="absolute -top-20 right-10 -z-10">
          <Image
            className="opacity-50 blur-[1px] md:opacity-70 md:blur-0 lg:opacity-100"
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
              <div className="bg-ww-900 text-ww-50 flex items-center gap-3 rounded px-2 py-1 pr-4">
                <ElementIcon
                  type={character.element[0]}
                  width={30}
                  height={30}
                />{" "}
                {character.element[0]}
              </div>
              <div className="bg-ww-900 text-ww-50 flex items-center gap-3 rounded px-2 py-1 pr-4">
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
      <h2 className="text-ww-50 mx-2 mb-2 text-xl lg:mx-0">
        {character.name} Skills
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.skills
          .filter((s) => s.group !== "Resonance Chain")
          .map((skill) => (
            <div key={skill.name} className="mb-6 flex gap-4 last:mb-0">
              <Image
                className="bg-ww-950 border-ww-900 h-20 w-20 rounded-full border"
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
      <h2 className="text-ww-50 mx-2 mb-2 text-xl lg:mx-0">
        {character.name} Resonance Chain
      </h2>
      <div className="mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.skills
          .filter((s) => s.group === "Resonance Chain")
          .map((skill) => (
            <div key={skill.name} className="mb-6 flex last:mb-0">
              <Image
                className="bg-ww-950 border-ww-900 h-20 w-20 rounded-full border"
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
    </div>
  );
}
