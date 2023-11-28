import SimpleRarityBox from "@components/SimpleRarityBox";
import { getUrl } from "@lib/imgUrl";
import type { TCGCard } from "genshin-data";
import type { Changelog } from "interfaces/genshin/changelog";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <div>
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
