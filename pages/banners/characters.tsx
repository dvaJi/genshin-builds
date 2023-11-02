import clsx from "clsx";
import GenshinData from "genshin-data";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import Metadata from "@components/Metadata";
import SimpleRarityBox from "@components/SimpleRarityBox";
import CharacterPortrait from "@components/genshin/CharacterPortrait";
import Badge from "@components/ui/Badge";
import Card from "@components/ui/Card";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale, getRemoteData } from "@lib/localData";
import { getTimeAgo } from "@lib/timeago";
import { localeToLang } from "@utils/locale-to-lang";
import { BannerHistorical, BannerReRunPrediction } from "interfaces/banner";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  historical: BannerHistorical[];
  rerunPrediction: BannerReRunPrediction[];
  charactersMap: Record<string, string>;
  locale: string;
};

const BannersCharacters = ({
  historical,
  rerunPrediction,
  locale,
  charactersMap,
}: Props) => {
  const { t } = useIntl("banners_characters");

  return (
    <div>
      {/* <div className="flex items-center justify-center md:hidden">
        <Button>
          {t({ id: "rerun_prediction", defaultMessage: "Rerun Prediction" })}
        </Button>
        <Button>{t({ id: "historical", defaultMessage: "Historical" })}</Button>
      </div> */}
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Character Banners",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Discover all the character banners and their rates",
        })}
      />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-4xl text-white">
            {t({ id: "rerun_prediction", defaultMessage: "Rerun Prediction" })}
          </h1>
          <Card>
            <div className="w-full">
              {rerunPrediction.map((h) => (
                <div
                  key={h.name}
                  className="mb-1 flex w-full border-b border-gray-700 pb-2 last:border-b-0"
                >
                  <Link href={`/character/${h.id}`}>
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
                            {getTimeAgo(new Date(h.lastRun).getTime(), locale)}
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
          </Card>
        </div>
        <div>
          <h1 className="text-4xl text-white">
            {t({ id: "historical", defaultMessage: "Historical" })}
          </h1>
          <Card>
            <div className="overflow-x-scroll md:overflow-x-hidden">
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
                      <Link key={m + h.time} href={`/character/${m}`}>
                        <SimpleRarityBox
                          img={getUrl(
                            `/characters/${m}/${m}_portrait.png`,
                            96,
                            96
                          )}
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
                      <Link key={m + h.time} href={`/character/${m}`}>
                        <SimpleRarityBox
                          img={getUrl(
                            `/characters/${m}/${m}_portrait.png`,
                            96,
                            96
                          )}
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const banners = await getRemoteData<Record<string, any>>(
    "genshin",
    "banners-characters"
  );
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name"],
  });

  return {
    props: {
      lngDict,
      historical: banners.historical,
      rerunPrediction: banners.rerunPrediction,
      charactersMap: characters.reduce(
        (map, cur) => {
          map[cur.id] = cur.name;
          return map;
        },
        {} as Record<string, string>
      ),
      locale,
      bgStyle: {
        image: getUrlLQ(`/regions/Inazuma_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 690px)",
        },
      },
    },
    revalidate: 60 * 60 * 24, // Once a day
  };
};

export default BannersCharacters;
