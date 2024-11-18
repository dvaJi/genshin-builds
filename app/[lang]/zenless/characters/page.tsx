import { i18n } from "i18n-config";
import { Metadata } from "next";
import Link from "next/link";

import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import type { Characters } from "@interfaces/zenless/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Zenless Zone Zero (ZZZ) Characters List",
  description:
    "A complete list of all playable characters in Zenless Zone Zero.",
};

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function CharactersPage({ params }: Props) {
  const { lang } = await params;
  const data = (
    await getZenlessData<Characters[]>({
      resource: "characters",
      language: lang,
      select: ["id", "name"],
    })
  )?.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="relative">
      <h1 className="text-6xl font-semibold">Characters</h1>
      <p>A complete list of all playable characters in Zenless Zone Zero.</p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1 md:gap-4">
        {data?.map((character) => (
          <Link
            key={character.id}
            href={`/${lang}/zenless/characters/${character.id}`}
            className="group relative items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
            prefetch={false}
          >
            <div className="flex aspect-square h-40 items-center justify-center rounded-t bg-black group-hover:bg-[#fbfe00]">
              <Image
                className="max-w-max"
                src={`/characters/portrait_${character.id}_2.webp`}
                alt={character.name}
                width={200}
                height={200}
              />
            </div>
            <div
              className="absolute bottom-0 flex h-7 w-full items-center justify-center"
              style={{
                background:
                  "repeating-linear-gradient( -45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 3px, rgba(60,60,60,0.5) 3px, rgba(60, 60, 60,0.5) 7px )",
              }}
            >
              <h2 className="font-bold text-white">{character.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
