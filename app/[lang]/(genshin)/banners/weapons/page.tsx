import clsx from "clsx";
import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import SimpleRarityBox from "@components/SimpleRarityBox";
import Badge from "@components/ui/Badge";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getRemoteData } from "@lib/localData";
import { getTimeAgo } from "@lib/timeago";
import { BannerHistorical, BannerReRunPrediction } from "interfaces/banner";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

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
    "banners_weapons"
  );
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Weapons Banners",
  });
  const description = t({
    id: "description",
    defaultMessage: "Discover all the weapons banners and their rates",
  });

  return genPageMetadata({
    title,
    description,
    path: `/banners/weapons`,
    locale,
  });
}

export default async function GenshinBannerWeapons({ params }: Props) {
  const { t, langData } = await useTranslations(
    params.lang,
    "genshin",
    "banners_weapons"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const { historical, rerunPrediction } = await getRemoteData<{
    historical: BannerHistorical[];
    rerunPrediction: BannerReRunPrediction[];
  }>("genshin", "banners-weapons");
  const weapons = await genshinData.weapons({
    select: ["id", "name"],
  });

  const weaponsMap = weapons.reduce(
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
                <Link href={`/weapon/${h.id}`}>
                  <SimpleRarityBox
                    key={h.name}
                    img={getUrl(`/weapons/${h.id}.png`, 96, 96)}
                    rarity={0}
                    name={""}
                    className="h-20 w-20"
                    nameSeparateBlock={true}
                    classNameBlock="w-20"
                  />
                </Link>
                <div className="flex w-full flex-col items-center justify-center">
                  <div className="flex w-full items-center justify-between">
                    <div className="block md:flex">
                      <span className="mr-2 text-xl text-white">
                        {weaponsMap[h.id]}
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
                          {getTimeAgo(
                            new Date(h.lastRun).getTime(),
                            params.lang
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs">{h.lastRun}</div>
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-700">
                    <div
                      className={clsx("h-1.5 rounded-full", {
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
          <div className="card overflow-x-scroll xl:overflow-x-hidden">
            {historical.map((h) => (
              <div
                key={h.name}
                className="mb-2 grid grid-cols-5 border-b border-gray-700 pb-4 last:border-b-0"
              >
                <div className="col-span-1 flex h-full flex-col justify-center">
                  <div>
                    <Badge className="text-xs text-gray-300">{h.time}</Badge>
                    <Badge className="text-xs text-gray-300">
                      v{h.version}
                    </Badge>
                  </div>
                </div>
                <div className="col-span flex min-w-min justify-center">
                  {h.main.map((m) => (
                    <Link key={m + h.time} href={`/weapon/${m}`}>
                      <SimpleRarityBox
                        img={getUrl(`/weapons/${m}.png`, 96, 96)}
                        rarity={5}
                        name={""}
                        className="h-12 w-12"
                        nameSeparateBlock={true}
                        classNameBlock="w-12"
                        alt={weaponsMap[m]}
                      />
                    </Link>
                  ))}
                </div>
                <div className="col-span-2 ml-10 flex min-w-max justify-center md:ml-0">
                  {h.secondary.map((m) => (
                    <Link key={m + h.time} href={`/weapon/${m}`}>
                      <SimpleRarityBox
                        key={m + h.time}
                        img={getUrl(`/weapons/${m}.png`, 96, 96)}
                        rarity={4}
                        name={""}
                        className="h-12 w-12"
                        nameSeparateBlock={true}
                        classNameBlock="w-12"
                        alt={weaponsMap[m]}
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
