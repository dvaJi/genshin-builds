import { useState } from "react";
import { GetStaticProps } from "next";
import GenshinData, { Fish } from "genshin-data";
import clsx from "clsx";

import Metadata from "@components/Metadata";
import FishingPointCard from "@components/FishingPointCard";

import { FishingPoint } from "interfaces/fishing";
import useIntl from "@hooks/use-intl";
import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { getUrl } from "@lib/imgUrl";

type Props = {
  fish: Record<string, Fish>;
  // baits: Record<string, Bait>;
  // fishingRods: Record<string, FishingRod>;
  // common: Record<string, string>;
  fishingPoints: Record<string, FishingPoint[]>;
};

const FishingPage = ({ fish, fishingPoints }: Props) => {
  const [fishFilter, setFishFilter] = useState<string[]>([]);
  const { t } = useIntl("fishing");

  const toggleFish = (id: string) => {
    const exist = fishFilter.includes(id);
    if (exist) {
      setFishFilter(fishFilter.filter((f) => f !== id));
    } else {
      setFishFilter([...fishFilter, id]);
    }
  };

  const filterPoints = (point: FishingPoint) => {
    if (fishFilter.length === 0) {
      return true;
    }

    return !!fishFilter.find((f) => point.fish.includes(f));
  };

  const isFishSelected = (id: string) => {
    if (fishFilter.length === 0) {
      return true;
    }

    return !!fishFilter.includes(id);
  };

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title",
          defaultMessage:
            "Genshin Impact Fishing (Fish, Baits, Fishing Rods and Fishing points)",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "This is an article about the list of fishing spots (points/spots) and the fish that appear in Genshin. The fishing points for Mondstadt, Liyue, Dragon Spine, and Inazuma are also summarized.",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "fishing", defaultMessage: "Fishing" })}
      </h2>
      <div>
        {Object.values(fish).map((f) => (
          <button
            key={f.id}
            onClick={() => toggleFish(f.id)}
            className={clsx(
              "border rounded hover:border-gray-700 hover:bg-vulcan-800 mr-1 hover:opacity-90",
              fishFilter.includes(f.id)
                ? "border-gray-700 bg-vulcan-800 opacity-100"
                : "border-gray-800 opacity-70"
            )}
          >
            <img
              className="w-12 h-12 mr-3"
              src={getUrl(`/fish/${f.id}.png`, 48, 48)}
              alt={f.name}
              title={f.name}
            />
          </button>
        ))}
      </div>
      <div className="">
        {Object.keys(fishingPoints).map((city) => (
          <FishingPointCard
            key={city}
            city={city}
            fishingPoints={fishingPoints[city].filter(filterPoints)}
            fish={fish}
            isFishSelected={isFishSelected}
          />
        ))}
      </div>
      <span className="text-xs">
        Source:{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://genshin-impact.fandom.com/wiki/Fishing#Fishing_Points"
        >
          GenshinWiki
        </a>
      </span>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  // const common = require(`../_content/data/common.json`)[locale];
  const fishingPoints = require(`../_content/data/fishing_points.json`);
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const fish = await genshinData.fish();
  // const baits = await genshinData.baits();
  // const fishingRods = await genshinData.fishingRods();

  return {
    props: {
      fish: fish.reduce<Record<string, Fish>>((obj, val) => {
        obj[val.id] = val;
        return obj;
      }, {}),
      // baits: baits.reduce<Record<string, Bait>>((obj, val) => {
      //   obj[val.id] = val;
      //   return obj;
      // }, {}),
      // fishingRods: fishingRods.reduce<Record<string, FishingRod>>(
      //   (obj, val) => {
      //     obj[val.id] = val;
      //     return obj;
      //   },
      //   {}
      // ),
      lngDict,
      // common,
      fishingPoints,
    },
  };
};

export default FishingPage;
