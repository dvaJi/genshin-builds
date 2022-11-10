import clsx from "clsx";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import TOFData, {
  Languages,
  Character,
  TeamFull,
  Gift,
  languages,
} from "@dvaji/tof-builds";

import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import TypeIcon from "@components/tof/TypeIcon";
import MatrixPortrait from "@components/tof/MatrixPortrait";
import CharacterPortrait from "@components/tof/CharacterPortrait";

import { getDefaultLocale, getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getBuildsByCharacterId } from "@lib/tofdata";
import useIntl, { IntlFormatProps } from "@hooks/use-intl";
import { Build } from "interfaces/tof/build";
import { getTofUrl, getTofUrlLQ } from "@lib/imgUrl";

type BuildFull = Build & {
  name: string;
  hash: string;
};

interface CharacterPageProps {
  character: Character;
  gifts: Gift[];
  teams: TeamFull[];
  builds: BuildFull[];
  locale: string;
}

const CharacterPage = ({
  character,
  gifts,
  teams,
  builds,
  locale,
}: CharacterPageProps) => {
  const { t } = useIntl("character");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} ToF Impact Build Guide",
          values: { name: character.name },
        })}
        pageDescription={character.description}
        jsonLD={generateJsonLd(locale, character, t)}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex w-full  flex-wrap items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={getTofUrl(`/characters/${character.id}.png`)}
            alt={character.name}
          />
          <div className="">
            <h2 className="mb-4 text-4xl font-extrabold text-tof-50 lg:text-6xl">
              {character.name}
            </h2>
            <span
              className={clsx("text-xl font-bold lg:text-3xl", {
                "text-purple-500": character.rarity === "SR",
                "text-yellow-200": character.rarity === "SSR",
              })}
            >
              {character.rarity}
            </span>
            <span className="ml-2 text-xl uppercase lg:text-3xl">
              {t({ id: "simulacrum", defaultMessage: "Simulacrum" })}
            </span>
          </div>
        </div>
        <div className="mx-4 flex w-full flex-row-reverse items-center justify-between lg:w-auto">
          <img
            src={getTofUrl(`/weapons/${character.weapon_id}.png`)}
            className="h-24 w-24 lg:h-48 lg:w-48"
            alt={character.weapon}
          />
          <div>
            <h2 className="mb-4 text-xl font-extrabold text-tof-50 lg:text-4xl">
              {character.weapon}
            </h2>
            <div className="flex justify-between">
              <div className="flex items-center">
                <TypeIcon type={character.element} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.element}
                </span>
              </div>
              <div className="flex items-center">
                <TypeIcon type={character.resonance} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.resonance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded border border-vulcan-700 bg-vulcan-700/90 py-4 px-4 shadow-lg">
        {builds.length > 0 && (
          <div className="mb-10 block">
            <h2 className="text-2xl font-bold uppercase text-tof-50">
              {t({
                id: "recommended_matrices",
                defaultMessage: "Recommended Matrices",
              })}
            </h2>
            <div className="flex flex-wrap">
              {builds.map((build) => (
                <Link
                  key={build.id}
                  href={`/tof/matrices/${build.id}`}
                  className="relative flex"
                >
                  <div className="absolute top-4 w-full text-center text-sm">
                    <span className="rounded bg-vulcan-600 py-1 px-2">
                      {t({
                        id: "pieces",
                        defaultMessage: "Pieces",
                      })}
                      : {build.pieces}
                    </span>
                  </div>
                  <MatrixPortrait matrix={build as any} />
                </Link>
              ))}
            </div>
          </div>
        )}
        {teams.length > 0 && (
          <div className="mb-10 block">
            <h2 className="text-2xl font-bold uppercase text-tof-50">
              {t({
                id: "teams",
                defaultMessage: "Teams",
              })}
            </h2>
            {teams.map((team) => (
              <div key={team.id} className="relative mb-4">
                <div className="text-xl font-bold text-tof-100 lg:ml-2">
                  {team.mode} - {team.comp}
                </div>
                <div className="flex border-b border-tof-900 pb-4 lg:mx-4">
                  {team.characters.map((character) => (
                    <Link
                      key={character.id}
                      href={`/tof/character/${character.id}`}
                      className="flex w-full flex-col items-center justify-center"
                    >
                      <CharacterPortrait character={character} />
                      <div className="rounded bg-vulcan-600 py-1 px-2 text-sm">
                        {character.role}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "skills",
              defaultMessage: "Skills",
            })}
          </h2>
          {character.skills.map((skill) => (
            <div key={skill.name} className="mb-6">
              <h3 className="text-lg font-bold text-tof-50">
                {skill.name}
                {skill.type.map((type) => (
                  <span
                    key={type}
                    className="ml-2 rounded bg-amber-200 px-2 py-1 text-xs text-tof-900"
                  >
                    {t({ id: type.toLowerCase(), defaultMessage: type })}
                  </span>
                ))}
              </h3>
              <p
                className="text text-tof-300"
                dangerouslySetInnerHTML={{ __html: skill.description }}
              />
            </div>
          ))}
        </div>
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "awakening",
              defaultMessage: "Awakening",
            })}
          </h2>
          {character.traits.map((trait, index) => (
            <div key={trait.name} className="mb-4">
              <h3 className="text-xl font-bold text-tof-50">{trait.name}</h3>
              <div className="mr-4 w-36 rounded bg-tof-900 px-2 text-yellow-100">
                {index === 0 ? "1200 Awakening" : "4000 Awakening"}
              </div>
              <p
                className="text text-tof-300"
                dangerouslySetInnerHTML={{ __html: trait.description }}
              />
            </div>
          ))}
        </div>
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "advancement",
              defaultMessage: "Advancement",
            })}
          </h2>
          {character.advancement.map((advancement, index) => (
            <div key={advancement} className="my-2 flex items-center py-2">
              <div className="mr-4 bg-tof-900 px-2 text-yellow-100">
                ★{index + 1}
              </div>
              <div dangerouslySetInnerHTML={{ __html: advancement }} />
            </div>
          ))}
        </div>
        <div className="mb-8 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "gifts",
              defaultMessage: "Gifts",
            })}
          </h2>
          <div className="flex flex-wrap">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className={clsx("m-1 rounded shadow", `TOF-bg-${gift.rarity}`)}
              >
                <img
                  className="h-16 w-16 lg:h-24 lg:w-24"
                  src={getTofUrl(`/gifts/${gift.id}.png`)}
                  title={gift.name}
                  alt={gift.name}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "upgrade_cost_planner",
              defaultMessage: "Upgrade Cost Planner",
            })}
          </h2>
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  {t({
                    id: "level",
                    defaultMessage: "Level",
                  })}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t({
                    id: "materials",
                    defaultMessage: "Materials",
                  })}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t({
                    id: "cost",
                    defaultMessage: "Cost",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {character.ascension.map((ascension) => (
                <tr
                  key={`asc-${ascension.ascension}-${ascension.level}-${ascension.cost}`}
                  className="border-b border-gray-700 bg-gray-800"
                >
                  <td className="text-center text-xl text-tof-100">
                    {ascension.level}
                  </td>
                  <td className="flex">
                    <div className="relative">
                      <div
                        className={clsx(
                          "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                          `TOF-bg-${ascension.mat1.rarity}`
                        )}
                      >
                        <img
                          src={getTofUrl(`/items/${ascension.mat1.id}.png`)}
                          alt={ascension.mat1.name}
                          title={ascension.mat1.name}
                        />
                      </div>
                      <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                        x{ascension.mat1.amount}
                      </h4>
                    </div>

                    {ascension.mat2 && (
                      <div className="relative">
                        <div
                          className={clsx(
                            "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                            `TOF-bg-${ascension.mat2.rarity}`
                          )}
                        >
                          <img
                            src={getTofUrl(`/items/${ascension.mat2.id}.png`)}
                            alt={ascension.mat2.name}
                            title={ascension.mat2.name}
                          />
                        </div>
                        <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                          x{ascension.mat2.amount}
                        </h4>
                      </div>
                    )}
                    {ascension.mat3 && (
                      <div className="relative">
                        <div
                          className={clsx(
                            "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                            `TOF-bg-${ascension.mat3.rarity}`
                          )}
                        >
                          <img
                            src={getTofUrl(`/items/${ascension.mat3.id}.png`)}
                            alt={ascension.mat3.name}
                            title={ascension.mat3.name}
                          />
                        </div>
                        <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                          x{ascension.mat3.amount}
                        </h4>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center text-lg text-tof-100">
                      <img
                        src={getTofUrl(`/icons/icon_gold_64.png`)}
                        alt="Gold"
                        className="w-12 lg:w-16"
                      />
                      {ascension.cost}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const generateJsonLd = (
  locale: string,
  character: Character,
  t: (props: IntlFormatProps) => string
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/",
          "name": "TOF-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/characters",
          "name": "${t({
            id: "characters",
            defaultMessage: "Characters",
          })}"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tof/character/${
    character.id
  }",
          "name": "${character.name}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const defaultLocale = getDefaultLocale(
    locale,
    languages as unknown as string[]
  );
  const lngDict = await getLocale(defaultLocale, "tof");
  const tofData = new TOFData({
    language: defaultLocale as Languages,
  });
  const characters = await tofData.characters({
    select: [
      "id",
      "name",
      "rarity",
      "element",
      "resonance",
      "weapon_id",
      "weapon",
    ],
  });
  const character = await tofData.characterbyId(params?.slug as string);
  const favoritesGift = await tofData.getFavoriteGiftByCharacterId(
    `${params?.slug}`
  );
  const gifts = await tofData.getGiftsByCharacterId(`${params?.slug}`);
  const teams = await tofData.getTeamsByCharacterId(`${params?.slug}`);
  const matrices = await tofData.matrices();
  const builds = getBuildsByCharacterId(`${params?.slug}`);

  return {
    props: {
      character,
      lngDict,
      gifts: [...favoritesGift, ...gifts],
      teams: teams.map((t) => ({
        ...t,
        characters: t.characters.map((c) => ({
          ...characters.find((ch) => ch.id === c.id),
          role: c.role || characters.find((ch) => ch.id === c.id)?.role || "",
        })),
      })),
      builds: builds.map((b) => ({
        ...b,
        name: matrices.find((m) => m.id === b.id)?.name,
        hash: matrices.find((m) => m.id === b.id)?.hash,
      })),
      locale: defaultLocale,
      bgStyle: {
        image: getTofUrlLQ(`/bg_characters/${character?.id}.png`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.5),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const tofData = new TOFData({ language: "en" });
  const characters = await tofData.characters();

  const paths: { params: { slug: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { slug: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
