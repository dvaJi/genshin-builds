import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import BlogPostCard from "@components/tof/BlogPostCard";
import Pagination from "@components/tof/Pagination";
import useTranslations from "@hooks/use-translations";
import { getPosts } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const POSTS_PER_PAGE = 10;

type Props = {
  params: {
    page: string;
    lang: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const currentPage = Number(params.page) || 1;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "tof", "blog");

  const title = t({
    id: "title",
    defaultMessage: "Tower of Fantasy Blog",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "The Tower of Fantasy Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Tower of Fantasy.",
  });
  return genPageMetadata({
    title,
    description,
    path: `/hsr/blog/page/${currentPage}`,
    locale,
  });
}

export default async function TOFBlogPage({ params }: Props) {
  const currentPage = Number(params.page) || 1;
  const { data, total } = await getPosts("tof", "en", {
    limit: POSTS_PER_PAGE,
    page: currentPage,
  });

  return (
    <div>
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
        currentPage={currentPage}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) =>
          page === 1
            ? `/${params.lang}/tof/blog`
            : `/${params.lang}/tof/blog/page/${page}`
        }
      />
    </div>
  );
}
