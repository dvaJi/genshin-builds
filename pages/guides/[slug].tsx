import Link from "next/link";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { FiChevronLeft } from "react-icons/fi";

import Card from "@components/ui/Card";
import Metadata from "@components/Metadata";
import GuideCard from "@components/GuideCard";

import { getLocale } from "@lib/localData";
import { getAllGuides, getGuideBySlug, Guide } from "@lib/guides_api";
import useIntl, { IntlFormatProps } from "@hooks/use-intl";

const YoutubeEmbed = dynamic(() => import("@components/YoutubeEmbed"), {
  ssr: false,
});

const GIMapEmbed = dynamic(() => import("@components/genshin/GIMapEmbed"), {
  ssr: false,
});

const CustomMap = dynamic(() => import("@components/CustomMap"), {
  ssr: false,
});

type GuideProps = {
  guide: Guide;
};

const GuideDetail = ({ guide }: GuideProps) => {
  const { t, locale } = useIntl("guides");

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
        <a className="group flex items-center hover:text-slate-200">
          <FiChevronLeft className="mr-2 text-xl" />
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
            <span className="mr-2 rounded bg-vulcan-600 p-1 px-1.5 text-xs">
              {guide.type}
            </span>
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="mr-2 rounded bg-vulcan-700 p-1 px-1.5 text-xs text-slate-500"
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
          <h3 className="mx-6 my-2 text-xl text-slate-200 lg:mx-0">
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
          <h3 className="mx-6 my-2 text-xl text-slate-200 lg:mx-0">
            {t({ id: "interactive_map", defaultMessage: "Interactive Map" })}
          </h3>
          <Card>
            <GIMapEmbed mapIds={guide.giMapIDs} />
          </Card>
        </div>
      )}
      {guide.giCustomMap && (
        <div className="mt-8">
          <h3 className="mx-6 my-2 text-xl text-slate-200 lg:mx-0">
            {t({ id: "interactive_map", defaultMessage: "Interactive Map" })}
          </h3>
          <Card>
            <CustomMap data={guide.giCustomMap} />
          </Card>
        </div>
      )}
      {guide.relatedGuides && (
        <div className="mx-6 mt-8 lg:mx-0">
          <h2 className="my-6 text-2xl font-semibold text-gray-200">
            {t({ id: "related_guides", defaultMessage: "Related Guides" })}
          </h2>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
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
  const lngDict = await getLocale(locale, "genshin");

  const guide = getGuideBySlug(`${params?.slug}`, locale, "genshin");

  return {
    props: {
      lngDict,
      guide,
      bgStyle: {
        image: guide.thumbnail,
        gradient: {
          background:
            "linear-gradient(rgba(26,28,35,.9),rgb(26, 29, 39) 620px)",
        },
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const paths: { params: { slug: string }; locale: string }[] = [];

  for (const locale of locales) {
    const guides = getAllGuides(locale, "genshin");

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
