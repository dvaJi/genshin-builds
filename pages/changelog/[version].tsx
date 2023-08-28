import GenshinData, { TCGCard } from "genshin-data";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";

import SimpleRarityBox from "@components/SimpleRarityBox";

import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getCommon, getData, getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";
import { Changelog } from "interfaces/genshin/changelog";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  changelog: Changelog;
  version: string;
  versions: string[];
  charactersMap: any;
  artifactsMap: any;
  weaponsMap: any;
  materialsMap: any;
  foodMap: any;
  tcgMap: Record<string, TCGCard>;
};

function ChangelogVersion({
  changelog,
  version,
  versions,
  charactersMap,
  artifactsMap,
  weaponsMap,
  materialsMap,
  foodMap,
  tcgMap,
}:
Props) {
  const router = useRouter();

  return (
    <div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div>
        <h1 className="text-2xl text-white">Changelog</h1>
        <select
          className="bg-vulcan-600"
          onChange={(e) => {
            e.preventDefault();
            router.push(`/changelog/${e.target.value}`);
          }}
          defaultValue={version}
        >
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {changelog.items.avatar && (
        <div>
          <h2 className="text-xl">Characters</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.avatar.map((a: string) => (
              <Link key={a} href={`/character/${a}`} className="mx-1">
                <SimpleRarityBox
                  img={getUrl(`/characters/${a}/image.png`, 120, 120)}
                  rarity={charactersMap[a].rarity}
                  name={charactersMap[a].name}
                  alt={charactersMap[a].name}
                  nameSeparateBlock
                  className="h-24 w-24"
                  classNameBlock="w-24"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {changelog.items.artifact && (
        <div>
          <h2 className="text-xl">Artifacts</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.artifact.map((a: string) => (
              <Link key={a} href={`/artifacts`} className="mx-1">
                <SimpleRarityBox
                  img={getUrl(`/artifacts/${a}.png`, 120, 120)}
                  rarity={artifactsMap[a].max_rarity}
                  name={artifactsMap[a].name}
                  alt={artifactsMap[a].name}
                  nameSeparateBlock
                  className="h-24 w-24"
                  classNameBlock="w-24"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {changelog.items.weapon && (
        <div>
          <h2 className="text-xl">Weapons</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.weapon.map((a: string) => (
              <Link key={a} href={`/weapon/${a}`} className="mx-1">
                <SimpleRarityBox
                  img={getUrl(`/weapons/${a}.png`, 120, 120)}
                  rarity={weaponsMap[a].rarity}
                  name={weaponsMap[a].name}
                  alt={weaponsMap[a].name}
                  nameSeparateBlock
                  className="h-24 w-24"
                  classNameBlock="w-24"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {changelog.items.material && (
        <div>
          <h2 className="text-xl">Materials</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.material.map((a: string) => (
              <div key={a} className="mx-1">
                {materialsMap[a] && (
                  <SimpleRarityBox
                    img={getUrl(`/materials/${a}.png`, 120, 120)}
                    rarity={materialsMap[a].rarity}
                    name={materialsMap[a].name}
                    alt={materialsMap[a].name}
                    nameSeparateBlock
                    className="h-24 w-24"
                    classNameBlock="w-24"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {changelog.items.food && (
        <div>
          <h2 className="text-xl">Food</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.food.map((a: string) => (
              <Link key={a} href={`/food`} className="mx-1">
                <SimpleRarityBox
                  img={getUrl(`/food/${foodMap[a].id}.png`, 120, 120)}
                  rarity={foodMap[a].rarity}
                  name={foodMap[a].name}
                  alt={foodMap[a].name}
                  nameSeparateBlock
                  className="h-24 w-24"
                  classNameBlock="w-24"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {changelog.items.tcg && (
        <div>
          <h2 className="text-xl">TCG</h2>
          <div className="flex flex-wrap justify-center">
            {changelog.items.tcg.map((a: string) => (
              <Link key={a} href={`/tcg/card/${a}`} className="mx-1">
                <SimpleRarityBox
                  img={getUrl(`/tcg/${tcgMap[a].id}.png`, 120, 120)}
                  rarity={0}
                  name={tcgMap[a].name}
                  alt={tcgMap[a].name}
                  nameSeparateBlock
                  className="h-24 w-24"
                  classNameBlock="w-24"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
      {/* <div>
        <h2 className="text-xl">NameCards</h2>
      </div>
      <div>
        <h2 className="text-xl">Books</h2>
      </div>
      <div>
        <h2 className="text-xl">Furnishings</h2>
      </div>
      <div>
        <h2 className="text-xl">Living Beings</h2>
      </div> */}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const characters = await genshinData.characters({
    select: ["id", "name", "rarity"],
  });
  const weapons = await genshinData.weapons({
    select: ["id", "name", "rarity"],
  });
  const food = await genshinData.food({
    select: ["id", "name", "rarity", "results"],
  });
  const artifacts = await genshinData.artifacts({
    select: ["id", "name", "max_rarity"],
  });
  const tcgCards = await genshinData.tcgCards({
    select: ["id", "name"],
  });

  const changelog = await getData<Changelog[]>("genshin", "changelog");
  const common = await getCommon(locale, "genshin");
  const materialsMap = await getAllMaterialsMap(genshinData);

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const foodMap: any = {};
  const tcgMap: any = {};

  if (!params?.version) return { notFound: true };

  const cl = changelog.find((c) => c.version === params?.version?.toString());

  if (!cl) return { notFound: true };

  const item = cl.items;
  item.avatar?.forEach((a: string) => {
    charactersMap[a] = characters.find((c) => c.id === a);
  });
  item.weapon?.forEach((w: string) => {
    weaponsMap[w] = weapons.find((wp) => wp.id === w);
  });

  item.artifact?.forEach((a: string) => {
    artifactsMap[a] = artifacts.find((w) => w.id === a);
  });
  item.food?.forEach((f: string) => {
    foodMap[f] = food.find((w) => w.id === f);
    const special = food.find((w) => {
      if (!w.results?.special) return false;
      return w.results?.special?.id === f;
    });
    if (special)
      foodMap[f] = {
        ...special.results.special,
        id: `${special.id}_special`,
        rarity: special.rarity,
      };
  });
  item.tcg?.forEach((t: string) => {
    tcgMap[t] = tcgCards.find((tc) => tc.id === t);
  });

  return {
    props: {
      changelog: cl,
      version: params?.version,
      versions: changelog.map((c) => c.version),
      charactersMap,
      weaponsMap,
      artifactsMap,
      materialsMap,
      tcgMap,
      foodMap,
      lngDict,
      common,
      bgStyle: {
        image: getUrlLQ(`/regions/Sumeru_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const changelog = await getData<Changelog[]>("genshin", "changelog");

  const paths: { params: { version: string }; locale: string }[] = [];

  for (const locale of locales) {
    changelog.forEach((c: any) => {
      paths.push({ params: { version: c.version }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default ChangelogVersion;
