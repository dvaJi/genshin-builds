import { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getImg } from "@lib/imgUrl";
import { getRemoteData } from "@lib/localData";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Character = {
  id: string;
  name: string;
  element: string;
  attack: string;
  faction: string;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Characters",
  description:
    "A complete list of all playable characters in Zenless Zone Zero.",
};

type Props = {
  params: {
    lang: string;
  };
};

export default async function CharactersPage({ params }: Props) {
  const data = await getRemoteData<Character[]>("zenless", "characters");
  return (
    <div>
      <h1 className="text-6xl font-semibold">Characters</h1>
      <p>A complete list of all playable characters in Zenless Zone Zero.</p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((character) => (
          <Link
            key={character.id}
            href={`/${params.lang}/zenless/characters/${character.id}`}
            className="group relative items-center justify-center rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
          >
            <div className="aspect-square h-40 rounded-t bg-black group-hover:bg-[#fbfe00]">
              <img
                className=""
                src={getImg("zenless", `/characters/${character.id}/icon.webp`)}
                alt={character.name}
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
