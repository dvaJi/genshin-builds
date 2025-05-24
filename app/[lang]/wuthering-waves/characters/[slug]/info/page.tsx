import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 43200;
export async function generateStaticParams() {
  return [];
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
  const t = await getTranslations({
    locale: lang,
    namespace: "WW.character_info",
  });
  const langData = getLangData(lang, "wuthering-waves");

  const character = await getWWData<Characters>({
    resource: "characters",
    language: langData,
    filter: {
      id: slug,
    },
  });

  if (!character) {
    return;
  }

  return genPageMetadata({
    title: t("title", { characterName: character.name }),
    description: t("description", { characterName: character.name }),
    path: `/wuthering-waves/characters/${slug}/info`,
    locale: langData,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("WW.character_info");
  const langData = getLangData(lang, "wuthering-waves");

  const character = await getWWData<Characters>({
    resource: "characters",
    language: langData,
    filter: {
      id: slug,
    },
  });

  if (!character) {
    return notFound();
  }

  return (
    <div>
      <div className="grid grid-cols-1">
        <Link
          className="mr-auto flex rounded-md border border-ww-700 bg-ww-900 px-3 py-2 text-white hover:opacity-80"
          href={`/wuthering-waves/characters/${character.id}`}
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
          <div>{t("info")}</div>
        </Link>
        <h1 className="mb-2 text-3xl text-white">{character.name}</h1>
        <div className="col-span-2 m-4 flex flex-col p-4">
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} VA
          </h2>
          <div className="relative z-20 mx-2 mb-6 grid grid-cols-2 gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            <div className="text-sm font-normal">
              {t("chinese")}: {character.info.cvNameCn}
            </div>
            <div className="text-sm font-normal">
              {t("japanese")}: {character.info.cvNameJp}
            </div>
            <div className="text-sm font-normal">
              {t("korean")}: {character.info.cvNameKo}
            </div>
            <div className="text-sm font-normal">
              {t("english")}: {character.info.cvNameEn}
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
            {t("forte_examination_report", {
              characterName: character.name,
            })}
          </h2>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">{t("resonance_power")}</h3>
            <div className="m-4 border-l-4 border-ww-700 p-4">
              <div className="text-sm font-normal leading-relaxed">
                {character.info.talentName}
              </div>
            </div>
          </div>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">{t("resonance_evaluation_report")}</h3>
            <div className="m-4 border-l-4 border-ww-700 p-4">
              <div
                className="text-sm font-normal leading-relaxed"
                dangerouslySetInnerHTML={{ __html: character.info.talentDoc }}
              />
            </div>
          </div>
          <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
            <h3 className="font-bold">{t("overclock_diagnostic_report")}</h3>
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
            {t("cherished_items_favors", {
              characterName: character.name,
            })}
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
            {t("story", {
              characterName: character.name,
            })}
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
            {t("voice", {
              characterName: character.name,
            })}
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
