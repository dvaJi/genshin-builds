import clsx from "clsx";
import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import getTranslations from "@hooks/use-translations";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "home"
  );

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves`,
    locale: langData,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "home"
  );
  const characters = await getWWData<Characters[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      {/* <CharactersList characters={characters} /> */}
      <div className="flex flex-wrap justify-center gap-4 rounded border border-zinc-800 bg-zinc-900 p-4">
        {characters
          ?.sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name))
          .map((char) => (
            <Link
              key={char.id}
              href={`/${langData}/wuthering-waves/characters/${char.id}`}
              className="group flex flex-col items-center justify-center gap-2"
              title={`${char.name} build`}
            >
              <div
                className={clsx(
                  `overflow-hidden rounded transition-all rarity-${char.rarity} ring-0 ring-ww-800 group-hover:ring-4`
                )}
              >
                <Image
                  className="transition-transform ease-in-out group-hover:scale-110"
                  src={`/characters/thumb_${char.id}.webp`}
                  alt={char.name}
                  width={124}
                  height={124}
                />
              </div>
              <h2 className="w-24 truncate text-center text-sm text-ww-100 group-hover:text-white">
                {char.name} Build
              </h2>
            </Link>
          ))}
      </div>
    </div>
  );
}
