import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import { i18n } from "@i18n-config";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { rarityToString } from "@utils/rarity";

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
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;
  const character = await getWWData<Characters>({
    resource: "characters",
    language: lang,
    filter: {
      id: slug,
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
    path: `/wuthering-waves/characters/${slug}`,
    locale: lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, slug } = await params;
  const character = await getWWData<Characters>({
    resource: "characters",
    language: lang,
    filter: {
      id: slug,
    },
    revalidate: 0,
  });

  if (!character) {
    return notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1">
        <Link
          className="mr-auto flex rounded-md border border-ww-700 bg-ww-900 px-3 py-2 text-white hover:opacity-80"
          href={`/${lang}/wuthering-waves/characters/${character.id}`}
        >
          <svg
            className="mr-2 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div>Info</div>
        </Link>
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} VA
          </h2>
          <div className="relative z-20 mx-2 mb-6 grid grid-cols-2 gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            <div className="text-sm font-normal">
              Chinese: {character.info.cvNameCn}
            </div>
            <div className="text-sm font-normal">
              Japanese: {character.info.cvNameJp}
            </div>
            <div className="text-sm font-normal">
              Korean: {character.info.cvNameKo}
            </div>
            <div className="text-sm font-normal">
              English: {character.info.cvNameEn}
            </div>
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Forte Examination Report
          </h2>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">Resonance Power</h3>
            <div className="m-4 border-l-4 border-ww-700 p-4">
              <div className="text-sm font-normal leading-relaxed">
                {character.info.talentName}
              </div>
            </div>
          </div>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">Resonance Evaluation Report</h3>
            <div className="m-4 border-l-4 border-ww-700 p-4">
              <div
                className="text-sm font-normal leading-relaxed"
                dangerouslySetInnerHTML={{ __html: character.info.talentDoc }}
              />
            </div>
          </div>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">Overclock Diagnostic Report</h3>
            <div className="m-4 border-l-4 border-ww-700 p-4">
              <div
                className="text-sm font-normal leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: character.info.talentCertification,
                }}
              />
            </div>
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Forte Examination Report
          </h2>
          {character.goods.map((good) => (
            <div
              key={good.title}
              className="relative z-20 mx-2 mb-2 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0"
            >
              <div className="flex items-center">
                <div className="w-24 shrink-0 md:w-32">
                  <Image
                    className="aspect-square"
                    src={`/treasures/${good.icon}.webp`}
                    alt={good.title}
                    width={128}
                    height={128}
                  />
                  <div className="text-center">{good.title}</div>
                </div>
                <div className="m-4 border-l-4 border-ww-700 p-4">
                  <div
                    className="text-sm font-normal leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: good.content }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Story
          </h2>
          {character.story.map((story) => (
            <div
              key={story.title}
              className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0"
            >
              <div className="font-bold">{story.title}</div>
              <div className="m-4 border-l-4 border-ww-700 p-4">
                <div
                  className="text-sm font-normal leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: story.content }}
                />
              </div>
            </div>
          ))}
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Voice
          </h2>
          {character.voices.map((voice) => (
            <Fragment key={voice.title}>
              <div className="relative z-20 mx-2 mb-4 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
                <div className="font-bold">{voice.title}</div>
                <div className="m-4 border-l-4 border-ww-700 p-4">
                  <div
                    className="text-sm font-normal"
                    dangerouslySetInnerHTML={{ __html: voice.content }}
                  />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_4"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
