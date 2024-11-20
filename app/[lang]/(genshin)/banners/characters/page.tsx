import { BannerHistorical, BannerReRunPrediction } from "interfaces/banner";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import SimpleRarityBox from "@components/SimpleRarityBox";
import CharacterPortrait from "@components/genshin/CharacterPortrait";
import Ads from "@components/ui/Ads";
import Badge from "@components/ui/Badge";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { getTimeAgo } from "@lib/timeago";
import { cn } from "@lib/utils";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(
    lang,
    "genshin",
    "banners_characters"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Character Banners",
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all the character banners and their rates",
  });

  return genPageMetadata({
    title,
    description,
    path: `/banners/characters`,
    locale,
  });
}

export default async function GenshinBannerCharacters({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "genshin",
    "banners_characters"
  );

  const { historical, rerunPrediction } = await getGenshinData<{
    historical: BannerHistorical[];
    rerunPrediction: BannerReRunPrediction[];
  }>({
    resource: "banners",
    language: lang,
    filter: {
      id: "characters",
    },
  });

  const characters = await getGenshinData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name"],
  });

  const charactersMap = characters.reduce(
    (map, cur) => {
      map[cur.id] = cur.name;
      return map;
    },
    {} as Record<string, string>
  );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl text-white">
            {t({ id: "rerun_prediction", defaultMessage: "Rerun Prediction" })}
          </h1>
          <div className="card w-full">
            {rerunPrediction.map((h) => (
              <div
                key={h.name}
                className="mb-1 flex w-full border-b border-gray-700 pb-2 last:border-b-0"
              >
                <Link href={`/${lang}/character/${h.id}`} prefetch={false}>
                  <CharacterPortrait character={{ id: h.id, name: "" }} />
                </Link>
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="flex w-full items-center justify-between">
                    <div className="block md:flex">
                      <span className="mr-2 text-xl text-white">
                        {charactersMap[h.id]}
                      </span>
                      <div>
                        <Badge className="mr-2 text-xs text-gray-300">
                          {t({
                            id: "runs",
                            defaultMessage: "{runs} runs",
                            values: { runs: h.runs.toString() },
                          })}
                        </Badge>
                        <Badge className="text-xs text-gray-300">
                          {getTimeAgo(new Date(h.lastRun).getTime(), lang)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs">{h.lastRun}</div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-700">
                    <div
                      className={cn("h-1.5 rounded-full", {
                        "bg-slate-500": h.percentage < 90,
                        "bg-yellow-500": h.percentage >= 90,
                      })}
                      style={{ width: `${h.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-4xl text-white">
            {t({ id: "historical", defaultMessage: "Historical" })}
          </h1>
          <div className="card overflow-x-scroll md:overflow-x-hidden">
            {historical.map((h) => (
              <div
                key={h.name}
                className="mb-2 grid grid-cols-3 border-b border-gray-700 pb-4 last:border-b-0"
              >
                <div className="flex h-full flex-col justify-center">
                  <h3 className="text-lg text-slate-100">{h.name}</h3>
                  <div>
                    <Badge className="text-xs text-gray-300">{h.time}</Badge>
                    <Badge className="text-xs text-gray-300">
                      v{h.version}
                    </Badge>
                  </div>
                </div>
                <div className="flex min-w-min justify-center">
                  {h.main.map((m) => (
                    <Link
                      key={m + h.time}
                      href={`/${lang}/character/${m}`}
                      prefetch={false}
                    >
                      <SimpleRarityBox
                        img={getUrl(`/characters/${m}/image.png`, 96, 96)}
                        rarity={5}
                        name={""}
                        alt={charactersMap[m]}
                        className="h-16 w-16"
                        nameSeparateBlock={true}
                        classNameBlock="w-16"
                      />
                    </Link>
                  ))}
                </div>
                <div className="ml-10 flex min-w-max justify-center md:ml-0">
                  {h.secondary.map((m) => (
                    <Link
                      key={m + h.time}
                      href={`/${lang}/character/${m}`}
                      prefetch={false}
                    >
                      <SimpleRarityBox
                        img={getUrl(`/characters/${m}/image.png`, 96, 96)}
                        rarity={4}
                        name={""}
                        alt={charactersMap[m]}
                        className="h-16 w-16"
                        nameSeparateBlock={true}
                        classNameBlock="w-16"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
