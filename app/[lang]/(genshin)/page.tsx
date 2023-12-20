import type { Character, Domains, Weapon } from "@interfaces/genshin";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import FarmableToday from "./farmable-today";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });
const ServerTimers = dynamic(() => import("@components/ServerTimers"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "ascension_planner"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Builds | Genshin Impact Wiki Database",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Learn about every character in Genshin Impact including their skills, talents, builds, and tier list.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/`,
    locale,
  });
}

export default async function IndexPage({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "ascension_planner"
  );

  const domains = await getGenshinData<Domains>({
    resource: "domains",
    language: langData,
  });

  const charactersMap = await getGenshinData<Record<string, Character>>({
    resource: "characters",
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const weaponsMap = await getGenshinData<Record<string, Weapon>>({
    resource: "weapons",
    select: ["id", "name", "rarity"],
    asMap: true,
  });
  const days = domains.characters[0].rotation.map((r) => r.day);

  return (
    <div>
      <div className="card">
        <h1 className="text-lg text-slate-100">
          {t({
            id: "welcome_title",
            defaultMessage: "Welcome to Genshin-Builds! ✨",
          })}
        </h1>
        <p>
          {t({
            id: "welcome_desc",
            defaultMessage:
              "Discover character builds, comprehensive guides, and a wiki database all in one place. Genshin-Builds is here to assist you in planning your farming activities with an ascension calculator. Keep track of your progress effortlessly with a convenient todo list. Level up your Genshin Impact experience with this invaluable resource!",
          })}
        </p>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div>
        <ServerTimers />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <FarmableToday
          days={days}
          characters={charactersMap}
          weapons={weaponsMap}
          domains={domains}
        />
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
      </div>
    </div>
  );
}
