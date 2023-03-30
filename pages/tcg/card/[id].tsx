import Link from "next/link";
import dynamic from "next/dynamic";
import { GetStaticProps, GetStaticPaths } from "next";
import GenshinData, { TCGCard } from "genshin-data";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Card from "@components/ui/Card";
import Badge from "@components/ui/Badge";
import Metadata from "@components/Metadata";

import { localeToLang } from "@utils/locale-to-lang";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl, getUrlLQ } from "@lib/imgUrl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

interface Props {
  card: TCGCard;
  locale: string;
}

const TCGCardPage = ({ card, locale }: Props) => {
  const { t } = useIntl("tcg_card");

  return (
    <div className="relative">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "{name} Genshin Impact Build Guide",
          values: { name: card.name },
        })}
        pageDescription={card.desc}
        jsonLD={generateJsonLd(locale, t, card)}
      />

      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <Link className="mt-4 p-4" href="/tcg">
        {t({ id: "back", defaultMessage: "Back" })}
      </Link>
      <div className="my-4 flex">
        <img
          src={getUrl(`/tcg/${card.id}.png`, 160, 160)}
          alt={card.name}
          title={card.name}
          width={160}
          height={274}
          className="aspect-square h-[274px] w-[160px] shrink"
        />
        <div className="ml-4">
          <h2 className="text-4xl font-semibold text-gray-200">{card.name}</h2>
          <div className="my-2 flex flex-wrap">
            {["hp", "energy", "weapon", "cost", "cost_type", "card_type"]
              .filter((key) => (card.attributes as any)[key])
              .map((key) => (
                <Badge key={key} className="my-0.5">
                  <span className="text-white">
                    {t({ id: key, defaultMessage: key })}:
                  </span>{" "}
                  {(card.attributes as any)[key]}
                </Badge>
              ))}
          </div>
          <div className="mt-2 ml-1">
            <p
              className="text-lg text-white"
              dangerouslySetInnerHTML={{ __html: card.title }}
            />
            <p
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: card.desc }}
            />
          </div>
          {card.attributes.source && (
            <div className="mt-6 text-sm">
              <span className="text-slate-200">
                {t({ id: "source", defaultMessage: "Source" })}:
              </span>{" "}
              <span className="text-slate-400">
                {card.attributes.source.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
      <h2 className="text-3xl font-semibold text-gray-200">
        {t({ id: "card_effects", defaultMessage: "Card Effects" })}
      </h2>
      <Card>
        {card.skills
          .filter((s) => s)
          .map((skill) => (
            <div
              key={skill.name}
              className="my-2 flex justify-between border-b border-vulcan-900 py-4 first:mt-0 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div>
                <h3 className="py-2 text-xl font-semibold text-gray-200">
                  {skill.name}
                </h3>
                <p dangerouslySetInnerHTML={{ __html: skill.desc }} />
              </div>
              {skill?.points?.length > 0 && (
                <div className="flex h-full flex-col content-center items-center justify-center">
                  {skill.points.map((point) => (
                    <div key={point.id} className="flex whitespace-nowrap">
                      <span className="text-lg">{point.count}</span>
                      <img
                        alt={point.id}
                        src={getUrl(`/tcg/${point.id}.png`, 90, 90)}
                        className="mx-1 h-8 align-middle"
                        title={point.type}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </Card>
    </div>
  );
};

const generateJsonLd = (
  locale: string,
  t: (props: IntlFormatProps) => string,
  card: TCGCard
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tcg",
          "name": "${t({
            id: "tcg_cards_title",
            defaultMessage: "Genius Invokation TCG Card Game",
          })}"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/tcg/card/${card.id}",
          "name": "${t({
            id: "title",
            defaultMessage: "{name} - Genshin Impact TCG Card List",
            values: { name: card.name },
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
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const cards = await genshinData.tcgCards();
  const card = cards.find((c) => c.id === params?.id);

  return {
    props: {
      lngDict,
      locale,
      card,
      bgStyle: {
        image: getUrlLQ(`/regions/Mondstadt_d.jpg`),
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const genshinData = new GenshinData();
  const cards = await genshinData.tcgCards();

  const paths: { params: { id: string }; locale: string }[] = [];

  for (const locale of locales) {
    cards.forEach((card) => {
      paths.push({ params: { id: card.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default TCGCardPage;
