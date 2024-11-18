import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import type { Weapons } from "@interfaces/wuthering-waves/weapons";
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
  const title = "Wuthering Waves (WuWa) Weapons | Builds and Team";
  const description =
    "A complete list of all weapons in Wuthering Waves (WuWa). This page offer most updated weapons' information including skills.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/weapons`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const weapons = await getWWData<Weapons[]>({
    resource: "weapons",
    language: lang,
    select: [
      "id",
      "name",
      "atk",
      "stat_name",
      "stat_value",
      "skill",
      "description",
    ],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">Wuthering Waves Weapons</h2>
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
        {weapons?.map((item) => (
          <div key={item.id} className="flex gap-2">
            <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border border-ww-900 bg-ww-950">
              <Image
                className=""
                src={`/weapons/${item.id}.webp`}
                alt={item.name}
                width={124}
                height={124}
              />
            </div>
            <div>
              <h2 className="mb-1 text-lg text-ww-100">{item.name} Build</h2>
              <div className="flex gap-4">
                <div className="flex items-center rounded border border-ww-900 bg-ww-950 px-1 text-xs text-ww-200">
                  Base ATK: {item.atk}
                </div>
                <div className="flex items-center rounded border border-ww-900 bg-ww-950 px-1 text-xs text-ww-200">
                  {item.stat_name}: {item.stat_value}
                </div>
              </div>
              <div className="mt-2 text-sm font-semibold text-ww-500">
                {item.skill}
              </div>
              <div
                className="text-sm text-ww-200"
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
