import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import Material from "@components/wuthering-waves/Material";
import getTranslations from "@hooks/use-translations";
import { i18n } from "@i18n-config";
import type {
  Ascension,
  Characters,
} from "@interfaces/wuthering-waves/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { rarityToString } from "@utils/rarity";
import { formatSimpleDesc } from "@utils/template-replacement";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const _characters = await getWWData<Characters[]>({
      resource: "characters",
      language: lang,
      select: ["id", "name", "rarity"],
    });

    if (!_characters) continue;

    routes.push(
      ..._characters.map((c) => ({
        lang,
        slug: c.id,
      }))
    );
  }

  return routes;
}

interface Props {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "character"
  );
  const character = await getWWData<Characters>({
    resource: "characters",
    language: langData,
    filter: {
      id: slug,
    },
  });

  if (!character) {
    return;
  }

  return genPageMetadata({
    title: t("title", { characterName: character.name }),
    description: t("description", {
      characterName: character.name,
      rarity: character.rarity.toString(),
      rarityString: rarityToString(character.rarity),
    }),
    path: `/wuthering-waves/characters/${slug}`,
    locale: langData,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, slug } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "character"
  );
  const character = await getWWData<Characters>({
    resource: "characters",
    language: langData,
    filter: {
      id: slug,
    },
  });

  if (!character) {
    return notFound();
  }

  // const characters = await getWWData<Characters[]>({
  //   resource: "characters",
  //   language: lang,
  //   select: ["id", "name", "rarity"],
  // });

  // const charactersTeam = character.teams.reduce(
  //   (acc, c) => {
  //     const [char] = c.split("~");
  //     const ch = characters?.find((c) => c.name === char)!;
  //     if (!acc[char]) {
  //       acc[char] = ch;
  //     }
  //     return acc;
  //   },
  //   {} as Record<string, Characters>
  // );

  const ascensionMaterials = character.ascensions.reduce(
    (acc, asc) => {
      asc.forEach((a) => {
        if (!acc[a._id]) {
          acc[a._id] = a;
        } else {
          acc[a._id].value = acc[a._id].value + a.value;
        }
      });
      return acc;
    },
    {} as Record<number, Ascension>
  );

  const talentLevelupMaterials = Object.values(character.skillTrees).reduce(
    (acc, tree) => {
      Object.values(tree.skill.consume).forEach((m) => {
        m.forEach((mat) => {
          if (!acc[mat._id]) {
            acc[mat._id] = mat;
          } else {
            acc[mat._id].value = acc[mat._id].value + mat.value;
          }
        });
      });
      return acc;
    },
    {} as Record<number, Ascension>
  );

  return (
    <div className="relative">
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="absolute -top-20 right-10 -z-10">
          <Image
            className="select-none opacity-50 blur-[1px] md:opacity-70 md:blur-0 lg:opacity-100"
            src={`/characters/portrait_${character.id}.webp`}
            alt={character.name}
            width={350}
            height={350}
          />
        </div>
        <div className="flex gap-4 px-2 lg:px-0">
          <div className="flex flex-col items-center justify-center gap-2">
            <div
              className={`flex-shrink-0 flex-grow-0 rarity-${character.rarity} h-[140px] w-[140px] overflow-hidden rounded-lg`}
            >
              <Image
                src={`/characters/thumb_${character.id}.webp`}
                alt={character.name}
                width={140}
                height={140}
              />
            </div>
            <Link
              href={`/${langData}/wuthering-waves/characters/${character.id}/info`}
              className="rounded-md border border-ww-700 bg-ww-900 px-3 py-2 text-xs text-white hover:bg-ww-800"
            >
              {t("story_and_voice")}
            </Link>
          </div>
          <div className="">
            <h1 className="mb-2 text-3xl text-white">
              {t("main_title", {
                characterName: character.name,
              })}
            </h1>
            <div className="flex flex-col items-baseline gap-2">
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("element")}:</span>
                <Image
                  src={`/icons/${character.element.icon}.webp`}
                  alt={`${character.element.name} type`}
                  width={26}
                  height={26}
                />
                {character.element.name}
              </div>
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("weapon_type")}:</span>
                <Image
                  src={`/icons/${character.weapon.icon}.webp`}
                  alt={`${character.weapon.name} type`}
                  width={26}
                  height={26}
                />
                {character.weapon.name}
              </div>
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("birth")}:</span>
                {character.info.birth}
              </div>
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("birthplace")}:</span>
                {character.info.country}
              </div>
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("affiliation")}:</span>
                {character.info.influence}
              </div>
              <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
                <span className="text-xs">{t("combat_roles")}:</span>
                {Object.values(character.tag).map((tag) => (
                  <Image
                    key={tag.id}
                    className="cursor-help"
                    src={`/icons/${tag.icon}.webp`}
                    alt={`${tag.name} tag`}
                    width={26}
                    height={26}
                    title={`${tag.name}: ${tag.desc}`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 max-w-3xl rounded bg-ww-900 p-2 text-sm leading-relaxed text-ww-50 md:bg-transparent md:p-0">
              {character.description}
            </p>
          </div>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {t("ascension_materials", {
              characterName: character.name,
            })}
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-wrap gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {/* {Object.values(ascensionMaterials).map((mat) => (
              <Link
                href={`/${lang}/wuthering-waves/items/${mat._id}`}
                key={mat.id}
                className="flex items-center gap-2 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
              >
                <Image
                  src={`/items/${mat.icon}.webp`}
                  alt={mat.name}
                  width={40}
                  height={40}
                />
                <div>
                  {mat.name} x {mat.value}
                </div>
              </Link>
            ))} */}
            {Object.values(ascensionMaterials).map((mat) => (
              <Material key={mat._id} lang={langData} item={mat} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {t("talent_lvlup_materials", {
              characterName: character.name,
            })}
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-wrap gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {Object.values(talentLevelupMaterials).map((mat) => (
              <Material
                key={mat._id}
                lang={langData}
                item={mat}
                showValue={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-4">
        <div>
          {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Sets
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.sets.map((set) => {
              const [name, pieces] = set.split("~");
              return (
                <div
                  key={set}
                  className="flex items-center gap-2 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
                >
                  <Image
                    src={`/icons/element_${name.replace(/ /g, "-")}.webp`}
                    alt={name}
                    width={40}
                    height={40}
                  />
                  <div className="rounded-md bg-ww-900 p-2 text-xs">
                    {pieces}
                  </div>
                  {name}
                </div>
              );
            })}
          </div> */}
        </div>
        <div>
          {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Primary Echo
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.primary_echo.map((echo) => (
              <div
                key={echo}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
              >
                <Image
                  src={`/echoes/${echo.replace(/ /g, "_").toLowerCase().replace("é", "e")}.webp`}
                  alt={echo}
                  width={40}
                  height={40}
                />
                <div>{echo}</div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      <div className="grid md:grid-cols-2 md:gap-4">
        <div>
          {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Stats
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.echoes.map((stat, i) => (
              <div
                key={stat}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-2"
              >
                {i === 0 ? "4 Cost: " : ""}
                {i === 1 ? "3 Cost: " : ""}
                {i === 2 ? "1 Cost: " : ""}
                {stat}
              </div>
            ))}
          </div> */}
        </div>
        <div>
          {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
            {character.name} Best Echo Substats
          </h2>
          <div className="relative z-20 mx-2 mb-6 flex flex-col gap-2 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
            {character.substats.map((substat, i) => (
              <div
                key={substat}
                className="flex items-center gap-4 rounded-md border border-ww-900 bg-ww-950 px-3 py-1"
              >
                <div className="rounded-md bg-ww-900 p-2 text-xs">{i + 1}</div>
                {substat}
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {character.name} Best Weapons
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex flex-wrap gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 text-ww-50 lg:mx-0">
        {character.weapons.map((weapon) => (
          <div
            key={weapon}
            className="flex items-center gap-4 rounded-md bg-ww-900 px-3 py-1"
          >
            <Image
              src={`/weapons/${weapon.replace(/\#/g, "-").replace(/ /g, "_").toLowerCase()}.webp`}
              alt={weapon}
              width={40}
              height={40}
            />
            {weapon}
          </div>
        ))}
      </div> */}

      {/* <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        Best {character.name} Team
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.teams.map((team) => {
          const [character, role] = team.split("~");
          const char = charactersTeam[character];
          return (
            <Link
              key={team}
              href={`/${lang}/wuthering-waves/characters/${char.id}`}
              className="mb-6 flex flex-col items-center"
              prefetch={false}
            >
              <div
                className={`overflow-hidden rounded transition-all rarity-${char.rarity} ring-0 ring-ww-800 group-hover:ring-4`}
              >
                <Image
                  className="transition-transform ease-in-out group-hover:scale-110"
                  src={`/characters/thumb_${char.id}.webp`}
                  alt={char.name}
                  width={124}
                  height={124}
                />
              </div>
              <h3>{character}</h3>
              <div className="text-sm text-ww-300">{role}</div>
            </Link>
          );
        })}
      </div> */}
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("skills", {
          characterName: character.name,
        })}
      </h2>
      <div className="relative z-20 mx-2 mb-6 flex-col gap-4 lg:mx-0">
        {Object.values(character.skillTrees).map((tree) => (
          <div
            key={tree.skillId}
            className="mb-2 rounded border border-zinc-800 bg-zinc-900 p-4 last:mb-0"
          >
            <div className="flex items-center gap-2">
              <Image
                className="h-10 w-10 rounded-full border border-ww-900 bg-ww-950"
                src={`/icons/${tree.skill.icon}.webp`}
                alt={tree.skill.name}
                width={40}
                height={40}
              />
              <h3 className="font-bold text-white">{tree.skill.name}</h3>
            </div>

            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: formatSimpleDesc(
                  tree.skill.desc.replace(/\\n/g, "<br>"),
                  tree.skill.param
                ),
              }}
            />
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("resonance_chain", {
          characterName: character.name,
        })}
      </h2>
      <div className="mx-2 mb-6 flex-col gap-4 lg:mx-0">
        {character.chains.map((skill) => (
          <div
            key={skill.name}
            className="mb-2 rounded border border-zinc-800 bg-zinc-900 p-4 last:mb-0"
          >
            <div className="flex items-center gap-2">
              <Image
                className="h-10 w-10 rounded-full border border-ww-900 bg-ww-950"
                src={`/icons/${skill.icon}.webp`}
                alt={skill.name}
                width={40}
                height={40}
              />
              <h3 className="font-bold text-white">{skill.name}</h3>
            </div>
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: formatSimpleDesc(
                  skill.desc.replace(/\\n/g, "<br>"),
                  skill.param
                ),
              }}
            />
          </div>
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("special_food", {
          characterName: character.name,
        })}
      </h2>
      <div className="mx-2 mb-6 flex-col gap-4 rounded border border-zinc-800 bg-zinc-900 p-4 lg:mx-0">
        {character.specialCook ? (
          <div className="mb-6 flex gap-4 last:mb-0">
            <Image
              className="h-20 w-20 rounded-full border border-ww-900 bg-ww-950"
              src={`/items/${character.specialCook.icon.split(".").pop()}.webp`}
              alt={character.specialCook.name}
              width={80}
              height={80}
            />
            <div className="p-1">
              <h3 className="text-ww-50">{character.specialCook.name}</h3>
              <div>
                <Stars stars={character.specialCook.rarity} />
              </div>
              <p className="text-sm text-ww-300">
                {character.specialCook.effect}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-ww-50">{t("no_special_food")}</div>
        )}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
