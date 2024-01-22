import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import BlogPostCard from "@components/genshin/BlogPostCard";
import Pagination from "@components/genshin/Pagination";
import useTranslations from "@hooks/use-translations";
import { getPostContents } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const POSTS_PER_PAGE = 10;

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "genshin", "blog");

  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Blog",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Stay up-to-date with Genshin Impact news, guides, and tips. Explore the Genshin Impact Blog for the latest updates and valuable insights to enhance your gaming experience.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/genshin/blog`,
    locale,
  });
}

export default async function GenshinBlogPage({ params }: Props) {
  const { data, total } = await getPostContents("genshin", params.lang, {
    limit: POSTS_PER_PAGE,
    page: 1,
  });

  return (
    <div className="bg-genshin-surface1 p-4">
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {data.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={total}
        currentPage={1}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) => `/${params.lang}/genshin/blog/page/${page}`}
      />
    </div>
  );
}
