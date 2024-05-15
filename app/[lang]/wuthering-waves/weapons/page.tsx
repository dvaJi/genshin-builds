import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import Image from "@components/wuthering-waves/Image";
import type { Weapons } from "@interfaces/wuthering-waves/weapons";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

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
  const title = "Wuthering Waves Weapons | Builds and Team";
  const description =
    "A complete list of all weapons in Wuthering Waves. This page offer most updated weapons' information including skills.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/weapons`,
    locale: params.lang,
  });
}

export default async function Page({}: Props) {
  const weapons = await getRemoteData<Weapons[]>("wuthering", "weapons");

  return (
    <div>
      <div className="my-2">
        <h2 className="text-ww-100 text-2xl">Wuthering Waves Weapons</h2>
        <p>
          A list of all Weapons and their skills in Wuthering Waves. This page
          offer most updated Weapons information.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {weapons.map((item) => (
          <div key={item.id} className="flex gap-2">
            <div className="bg-ww-950 border-ww-900 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border">
              <Image
                className=""
                src={`/weapons/${item.id}.webp`}
                alt={item.name}
                width={124}
                height={124}
              />
            </div>
            <div>
              <h2 className="text-ww-100 mb-1 text-lg">{item.name} Build</h2>
              <div className="flex gap-4">
                <div className="text-ww-200 bg-ww-950 border-ww-900 flex items-center rounded border px-1 text-xs">
                  Base ATK: {item.atk}
                </div>
                <div className="text-ww-200 bg-ww-950 border-ww-900 flex items-center rounded border px-1 text-xs">
                  {item.stat_name}: {item.stat_value}
                </div>
              </div>
              <div className="text-ww-500 mt-2 text-sm font-semibold">
                {item.skill}
              </div>
              <div
                className="text-ww-200 text-sm"
                dangerouslySetInnerHTML={{
                  __html: item.description.replace(/\\n/g, "<br>"),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
