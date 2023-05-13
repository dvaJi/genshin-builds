import clsx from "clsx";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import HSRData, { type Character, renderDescription } from "hsr-data";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Stars from "@components/hsr/Stars";
import Metadata from "@components/Metadata";
import CharacterTrace from "@components/hsr/CharacterTrace";
import CharacterInfoStat from "@components/hsr/CharacterInfoStat";

import { localeToHSRLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { getHsrUrl } from "@lib/imgUrl";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

interface CharacterPageProps {
  character: Character;
  locale: string;
}

const CharacterPage = ({ character, locale }: CharacterPageProps) => {
  const { t } = useIntl("character");

  const lastAscend = character.ascends[character.ascends.length - 1];
  const maxHp = lastAscend.hpBase + lastAscend.hpAdd * 79;
  const maxAtk = lastAscend.attackBase + lastAscend.attackAdd * 79;
  const maxDef = lastAscend.defenseBase + lastAscend.defenseAdd * 79;
  const maxSpeed = lastAscend.speedBase + lastAscend.speedAdd * 79;

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail {name} Build Guide",
          values: { name: character.name },
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Discover the best builds and teams for {name} in Honkai: Star Rail. Also included are their skills, upgrade costs, and more.",
          values: { name: character.name },
        })}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="flex flex-col md:flex-row">
        <div className="flex justify-center">
          <img
            src={getHsrUrl(`/characters/${character.id}/icon.png`)}
            alt={character.name}
            width={144}
            height={168}
            className={clsx("rounded border", {
              "border-yellow-400": character.rarity === 5,
              "border-purple-400": character.rarity === 4,
            })}
          />
        </div>
        <div className="ml-4">
          <h2 className="flex items-center text-3xl font-semibold leading-loose text-slate-50">
            {character.name}
            <img
              src={getHsrUrl(`/${character.combat_type.id}.webp`)}
              alt={character.combat_type.name}
              width={24}
              height={24}
              loading="lazy"
              className="ml-2 inline-block w-[24px] select-none"
            />
          </h2>
          <div className="flex items-center">
            <Stars stars={character.rarity} />
            <div className="ml-4 flex items-center">
              <img
                src={getHsrUrl(`/${character.path.id}.webp`)}
                alt={character.path.name}
                width="20"
                height="20"
                loading="lazy"
                className="mr-2 inline-block w-[16px] select-none"
              />
              <span className="text-sm">{character.path.name}</span>
            </div>
          </div>
          <p>{character.description}</p>
        </div>
        <div className="ml-3 flex w-full max-w-[320px] flex-col justify-center md:ml-8">
          <CharacterInfoStat label="hp" value={maxHp} max={1500} />
          <CharacterInfoStat label="atk" value={maxAtk} max={1500} />
          <CharacterInfoStat label="def" value={maxDef} max={1000} />
          <CharacterInfoStat label="speed" value={maxSpeed} max={500} />
        </div>
      </div>
      <div className="relative bg-hsr-surface1 p-4 shadow-2xl">
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

        <div className="">
          <div>
            <h2 className="text-xl text-slate-200">
              {t({
                id: "skills",
                defaultMessage: "Skills",
              })}
            </h2>
            <div>
              {character.skills
                .filter((s) => s.tag)
                .map((skill) => (
                  <div
                    key={skill.id}
                    className="group relative mb-2 flex items-center"
                  >
                    <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                      <div className="flex-shrink-0 justify-center rounded-full bg-hsr-surface3 text-center">
                        <img
                          src={getHsrUrl(
                            `/characters/${character.id}/${skill.id}.png`,
                            70,
                            70
                          )}
                          width={64}
                          height={64}
                          className="p-1"
                          alt={skill.name}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col p-2">
                      <div className="flex items-center">
                        <div className="font-semibold text-slate-200">
                          {skill.name}
                        </div>
                        <div className="mx-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
                          {skill.type}
                        </div>
                        <div className="mx-1 rounded bg-zinc-800 px-2 py-1 text-xs text-slate-300">
                          {skill.tag}
                        </div>
                      </div>
                      <div className="flex flex-wrap">
                        <p
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: renderDescription(
                              skill.desc,
                              skill.levels[0].params
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl text-slate-200">{t({
                id: "traces",
                defaultMessage: "Traces",
              })}</h2>
            <div className="flex flex-col">
              {character.skillTreePoints
                .sort((a, b) => a.type - b.type)
                .map((trace) => (
                  <CharacterTrace
                    key={trace.id}
                    trace={trace}
                    characterId={character.id}
                  />
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl text-slate-200">{t({
                id: "eidolon",
                defaultMessage: "Eidolon",
              })}</h2>
            <div>
              {character.eidolons.map((eidolon) => (
                <div key={eidolon.id} className="mb-2 flex items-center">
                  <div className="mr-4 flex w-[64px] flex-shrink-0 items-center justify-center">
                    <div className="flex-shrink-0 justify-center rounded-full bg-hsr-surface3 text-center">
                      <img
                        src={getHsrUrl(
                          `/characters/${character.id}/${eidolon.id}.png`
                        )}
                        width={64}
                        height={64}
                        alt={eidolon.name}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">
                      {eidolon.name}
                    </div>
                    <div>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: eidolon.desc ?? "" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateJsonLd = (
  locale: string,
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
          "@id": "https://genshin-builds.com/${locale}/hsr/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/characters",
          "name": "${t({
            id: "characters",
            defaultMessage: "Characters",
          })}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({ language: localeToHSRLang(locale) });
  const characters = await hsrData.characters();
  const character = characters.find((c) => c.id === params?.id);

  if (!character) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      character,
      lngDict,
      locale,
      // bgStyle: {
      //   image: getUrlLQ(
      //     `/regions/${common[character.region] || "Mondstadt"}_d.jpg`,
      //     900,
      //     900
      //   ),
      //   gradient: {
      //     background:
      //       "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
      //   },
      //   stickyImage: getUrlLQ(
      //     `/characters/${character.id}/header_image.png`,
      //     900,
      //     900
      //   ),
      // },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const hsrData = new HSRData();
  const characters = await hsrData.characters({ select: ["id"] });

  const paths: { params: { id: string }; locale: string }[] = [];

  for (const locale of locales) {
    characters.forEach((character) => {
      paths.push({ params: { id: character.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default CharacterPage;
