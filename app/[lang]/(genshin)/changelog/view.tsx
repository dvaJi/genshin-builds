"use client";

import type { Changelog } from "interfaces/genshin/changelog";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import SimpleRarityBox from "@components/SimpleRarityBox";
import { Link, useRouter } from "@i18n/navigation";
import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

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
  locale: string;
};

export default function ChangelogVersion({
  changelog,
  version,
  versions,
  charactersMap,
  artifactsMap,
  weaponsMap,
  materialsMap,
  foodMap,
  tcgMap,
}: Props) {
  const t = useTranslations("Genshin.changelog");
  const router = useRouter();

  return (
    <div>
      <div className="mx-2 md:mx-0">
        <h1 className="text-2xl text-white">{t("changelog", { version })}</h1>
        <p className="text-sm">{t("changelog_description", { version })}</p>
        <div className="my-2">
          <span>{t("version_selecter")}</span>
          <select
            className="ml-2 h-8 rounded-md bg-vulcan-600 py-1 text-white"
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
      </div>
      <div className="flex flex-col gap-6">
        {changelog.items.avatar?.length ? (
          <div>
            <h2 className="text-xl text-white">Characters</h2>
            <div className="card flex flex-wrap justify-center">
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
        ) : null}
        {changelog.items.artifact?.length ? (
          <div>
            <h2 className="text-xl text-white">Artifacts</h2>
            <div className="card flex flex-wrap justify-center">
              {changelog.items.artifact.map((a: string) => (
                <Link key={a} href={`/artifacts/${a}`} className="mx-1">
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
        ) : null}
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        {changelog.items.weapon.length ? (
          <div>
            <h2 className="text-xl text-white">Weapons</h2>
            <div className="card flex flex-wrap justify-center">
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
        ) : null}
        {changelog.items.material?.length ? (
          <div>
            <h2 className="text-xl text-white">Materials</h2>
            <div className="card flex flex-wrap justify-center">
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
        ) : null}
        {changelog.items.food.length ? (
          <div>
            <h2 className="text-xl text-white">Food</h2>
            <div className="card flex flex-wrap justify-center">
              {changelog.items.food.map((a: string) => (
                <Link key={a} href={`/food/${a}`} className="mx-1">
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
        ) : null}
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        {changelog.items.tcg?.length ? (
          <div>
            <h2 className="text-xl text-white">TCG</h2>
            <div className="card flex flex-wrap justify-center">
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
        ) : null}
        {/* <div>
        <h2 className="text-xl text-white">NameCards</h2>
      </div>
      <div>
        <h2 className="text-xl text-white">Books</h2>
      </div>
      <div>
        <h2 className="text-xl text-white">Furnishings</h2>
      </div>
      <div>
        <h2 className="text-xl text-white">Living Beings</h2>
      </div> */}
      </div>
    </div>
  );
}
