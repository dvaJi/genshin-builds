import { GetStaticProps } from "next";

import Metadata from "@components/Metadata";

import { getLocale } from "@lib/localData";
import { getAllGuides, Guide } from "@lib/guides_api";
import useIntl from "@hooks/use-intl";
import GuideCard from "@components/GuideCard";

type TodoProps = {
  guides: Guide[];
};

const Guides = ({ guides }: TodoProps) => {
  const { t } = useIntl("guides");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Guides",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Track your Genshin Impact achievement easily",
        })}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "guides", defaultMessage: "Guides" })}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
        {guides.map((guide) => (
          <GuideCard key={guide.title} guide={guide} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const guides = getAllGuides(locale, "genshin").map((guide) => ({
    title: guide.title,
    slug: guide.slug,
    tags: guide.tags,
    thumbnail: guide.thumbnail,
    type: guide.type,
    date: guide.date,
  }));

  return {
    props: { lngDict, guides },
  };
};

export default Guides;
