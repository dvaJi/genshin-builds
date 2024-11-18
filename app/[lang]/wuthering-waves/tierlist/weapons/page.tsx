import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import type { TierlistWeapons } from "@interfaces/wuthering-waves/tierlist-weapons";
import type { Weapons } from "@interfaces/wuthering-waves/weapons";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

import Tier from "./tier";

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
  const title =
    "Best Wuthering Waves (WuWa) Weapons Tierlist - Ultimate Ranking Guide";
  const description =
    "Explore the best Wuthering Waves Weapons Tierlist. Discover detailed rankings and weapon insights. Find out which weapons dominate!";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/tierlist/weapons`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const tierlist = await getWWData<TierlistWeapons>({
    resource: "tierlist",
    language: lang,
    filter: {
      id: "weapons",
    },
  });

  const weapons = await getWWData<Record<string, Weapons>>({
    resource: "weapons",
    language: lang,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">
          Wuthering Waves (WuWa) Weapons Tierlist - Ultimate Ranking and
          Analysis
        </h2>
        <p>
          Welcome to our comprehensive Wuthering Waves Weapons Tierlist. Here,
          we rank the weapons based on their power, versatility, and overall
          effectiveness in the game. Whether you&apos;re a beginner or a
          seasoned player, this guide will help you make informed decisions.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="mx-2 my-4 flex gap-4 md:mx-0">
        <a
          href="#sword"
          className="rounded-md border border-ww-700 bg-ww-950 px-3 py-2 hover:opacity-80"
        >
          Sword
        </a>
        <a
          href="#broadblade"
          className="rounded-md border border-ww-700 bg-ww-950 px-3 py-2 hover:opacity-80"
        >
          Broadblade
        </a>
        <a
          href="#gauntlet"
          className="rounded-md border border-ww-700 bg-ww-950 px-3 py-2 hover:opacity-80"
        >
          Gauntlet
        </a>
        <a
          href="#rectifier"
          className="rounded-md border border-ww-700 bg-ww-950 px-3 py-2 hover:opacity-80"
        >
          Rectifier
        </a>
        <a
          href="#pistol"
          className="rounded-md border border-ww-700 bg-ww-950 px-3 py-2 hover:opacity-80"
        >
          Pistol
        </a>
      </div>
      <h2 id="sword" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Swords Tierlist
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.sword ?? {}).map(([tier, chars]) => (
          <Tier
            key={"sword" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 id="broadblade" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Broadblade Tierlist
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.broadblade ?? {}).map(([tier, chars]) => (
          <Tier
            key={"broadblade" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="gauntlet" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Gauntlet Tierlist
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.gauntlet ?? {}).map(([tier, chars]) => (
          <Tier
            key={"gauntlet" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="rectifier" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Rectifier Tierlist
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.rectifier ?? {}).map(([tier, chars]) => (
          <Tier
            key={"rectifier" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 id="pistol" className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Pistol Tierlist
      </h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.pistol ?? {}).map(([tier, chars]) => (
          <Tier
            key={"pistol" + tier}
            tier={tier}
            weapons={chars}
            weaponsMap={weapons ?? {}}
          />
        ))}
      </div>
    </div>
  );
}
