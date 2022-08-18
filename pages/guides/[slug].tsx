import Link from "next/link";
import dynamic from "next/dynamic";
import { GetStaticPaths, GetStaticProps } from "next";
import { FiChevronLeft } from "react-icons/fi";

import Card from "@components/ui/Card";
import GuideCard from "@components/GuideCard";

import { getLocale } from "@lib/localData";
import { getAllGuides, getGuideBySlug, Guide } from "@lib/guides_api";
import { ReactNode, useEffect } from "react";
import { setBackground } from "@state/background-atom";
import useIntl, { IntlFormatProps } from "@hooks/use-intl";
import Metadata from "@components/Metadata";

const YoutubeEmbed = dynamic(() => import("@components/YoutubeEmbed"), {
  ssr: false,
});

const GIMapEmbed = dynamic(() => import("@components/GIMapEmbed"), {
  ssr: false,
});

type GuideProps = {
  guide: Guide;
};

const GuideDetail = ({ guide }: GuideProps) => {
  const { t, locale } = useIntl("guides");
  useEffect(() => {
    setBackground({
      image: guide.thumbnail,
      gradient: {
        background: "linear-gradient(rgba(26,28,35,.9),rgb(26, 29, 39) 620px)",
      },
    });
  }, [guide.thumbnail]);

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title_detail",
          defaultMessage: "{title} - Genshin Impact Guides",
          values: { title: guide.title },
        })}
        pageDescription={guide.description}
        jsonLD={generateJsonLd(guide, locale, t)}
      />
      <Link href="/guides">
        <a className="flex items-center group hover:text-slate-200">
          <FiChevronLeft className="text-xl mr-2" />
          {t({ id: "back_to_guides", defaultMessage: "Back to Guides" })}
        </a>
      </Link>
      <div className="mx-6 lg:mx-0">
        <h2 className="my-4 text-2xl font-semibold text-gray-200">
          {guide.title}
        </h2>
        <p>{guide.description}</p>
        <div className="my-4">
          <div className="inline-block">
            <span className="bg-vulcan-600 rounded mr-2 p-1 px-1.5 text-xs">
              {guide.type}
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="bg-vulcan-700 text-slate-500 rounded mr-2 p-1 px-1.5 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="inline-block text-sm">
            {t({
              id: "published_at",
              defaultMessage: "Published at {date}",
              values: { date: guide.date },
            })}
          </div>
        </div>
      </div>
      {guide.ytVideosUrl && (
        <div className="mt-8">
          <h3 className="mx-6 lg:mx-0 text-xl text-slate-200 my-2">
            {t({ id: "youtube_tutorial", defaultMessage: "Youtube Tutorial" })}
          </h3>
          <Card>
            {guide.ytVideosUrl
              .map<ReactNode>((embedId) => (
                <YoutubeEmbed key={embedId} embedId={embedId} />
              ))
              .reduce((prev, curr, i) => [
                prev,
                <div key={`yt_divider_${i}`} className="mb-6" />,
                curr,
              ])}
          </Card>
        </div>
      )}
      {guide.giMapIDs && (
        <div className="mt-8">
          <h3 className="mx-6 lg:mx-0 text-xl text-slate-200 my-2">
            {t({ id: "interactive_map", defaultMessage: "Interactive Map" })}
          </h3>
          <Card>
            <GIMapEmbed mapIds={guide.giMapIDs} />
          </Card>
        </div>
      )}
      {guide.relatedGuides && (
        <div className="mx-6 lg:mx-0 mt-8">
          <h2 className="my-6 text-2xl font-semibold text-gray-200">
            {t({ id: "related_guides", defaultMessage: "Related Guides" })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
            {guide.relatedGuides.map((guide) => (
              <GuideCard key={guide.title} guide={guide} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const generateJsonLd = (
  guide: Guide,
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
          "@id": "https://genshin-builds.com/${locale}/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/guides",
          "name": "${t({
            id: "guides",
            defaultMessage: "Guides",
          })}"
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/guides/${guide.slug}",
          "name": "${guide.title}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  locale = "en",
  params,
}) => {
  const lngDict = await getLocale(locale);

  const guide = getGuideBySlug(`${params?.slug}`, locale);

  return {
    props: { lngDict, guide },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const paths: { params: { slug: string }; locale: string }[] = [];

  for (const locale of locales) {
    const guides = getAllGuides(locale);

    for (const guide of guides) {
      paths.push({
        params: { slug: guide.slug },
        locale,
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export default GuideDetail;
