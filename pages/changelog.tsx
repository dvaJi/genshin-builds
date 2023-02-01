import Link from "next/link";
import { useState } from "react";
import { GetStaticProps } from "next";
import GenshinData from "genshin-data";

import SimpleRarityBox from "@components/SimpleRarityBox";

import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToLang } from "@utils/locale-to-lang";
import { getAllMaterialsMap } from "@utils/materials";

type Props = {
  changelog: any;
  charactersMap: any;
  artifactsMap: any;
  weaponsMap: any;
  materialsMap: any;
  foodMap: any;
};

function Changelog({
  changelog,
  charactersMap,
  artifactsMap,
  weaponsMap,
  materialsMap,
  foodMap,
}: Props) {
  const [selectedVersion, setSelectedVersion] = useState(
    changelog[changelog.length - 1]
  );

  return (
    <div>
      <div>
        <h1 className="text-2xl text-white">Changelog</h1>
        <select
          className="bg-vulcan-600"
          onChange={(e) => {
            setSelectedVersion(
              changelog.find((cl: any) => cl.version === e.target.value)
            );
          }}
          defaultValue={selectedVersion.version}
        >
          {changelog.map((cl: any) => (
            <option key={cl.version} value={cl.version}>
              {cl.version}
            </option>
          ))}
        </select>
      </div>
      {selectedVersion.items.avatar && (
        <div>
          <h2 className="text-xl">Characters</h2>
          <div className="flex flex-wrap justify-center">
            {selectedVersion.items.avatar.map((a: string) => (
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
      {selectedVersion.items.artifact && (
        <div>
          <h2 className="text-xl">Artifacts</h2>
          <div className="flex flex-wrap justify-center">
            {selectedVersion.items.artifact.map((a: string) => (
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
      {selectedVersion.items.weapon && (
        <div>
          <h2 className="text-xl">Weapons</h2>
          <div className="flex flex-wrap justify-center">
            {selectedVersion.items.weapon.map((a: string) => (
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
      {selectedVersion.items.material && (
        <div>
          <h2 className="text-xl">Materials</h2>
          <div className="flex flex-wrap justify-center">
            {selectedVersion.items.material.map((a: string) => (
              <div key={a} className="mx-1">
                {materialsMap[a] && (
                  <SimpleRarityBox
                    img={getUrl(`/${materialsMap[a].type}/${a}.png`, 120, 120)}
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
      {selectedVersion.items.food && (
        <div>
          <h2 className="text-xl">Food</h2>
          <div className="flex flex-wrap justify-center">
            {selectedVersion.items.food.map((a: string) => (
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

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
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

  const { default: changelog = {} }: any = await import(
    `../_content/genshin/data/changelog.json`
  );
  const materialsMap = await getAllMaterialsMap(genshinData);

  const charactersMap: any = {};
  const weaponsMap: any = {};
  const artifactsMap: any = {};
  const foodMap: any = {};

  for (const cl of changelog) {
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
  }

  return {
    props: {
      changelog,
      charactersMap,
      weaponsMap,
      artifactsMap,
      materialsMap,
      foodMap,
      lngDict,
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

export default Changelog;
