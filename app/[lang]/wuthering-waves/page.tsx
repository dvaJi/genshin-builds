import clsx from "clsx";
import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Image from "@components/wuthering-waves/Image";
import type { Characters } from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const title = "Wuthering Waves (WuWa) Characters | Builds and Team";
  const description =
    "A complete list of all characters in Wuthering Waves (WuWa). This page offer most updated characters' information including weapons.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves`,
    locale: params.lang,
  });
}

export default async function Page({ params }: Props) {
  const characters = await getWWData<Characters[]>({
    resource: "characters",
    language: params.lang,
    select: ["id", "name", "rarity"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">
          Wuthering Waves Characters List | Builds and Team
        </h2>
        <p>
          A complete list of all characters in Wuthering Waves. This page offer
          most updated characters information including weapons.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      {/* <CharactersList characters={characters} /> */}
      <div className="flex flex-wrap justify-center gap-4 rounded border border-zinc-800 bg-zinc-900 p-4">
        {characters.map((char) => (
          <Link
            key={char.id}
            href={`/${params.lang}/wuthering-waves/characters/${char.id}`}
            className="group flex flex-col items-center justify-center gap-2"
            prefetch={false}
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
