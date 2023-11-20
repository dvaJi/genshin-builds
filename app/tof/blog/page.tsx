import type { Metadata } from "next";
import dynamic from "next/dynamic";

import BlogPostCard from "@components/tof/BlogPostCard";
import Pagination from "@components/tof/Pagination";
import { getPosts } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import useTranslations from "@hooks/use-translations";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const POSTS_PER_PAGE = 10;

export async function generateMetadata(): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations("tof", "blog");

  const title = t({
    id: "title",
    defaultMessage: "Tower of Fantasy Blog",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "The Tower of Fantasy Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Tower of Fantasy.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale,
      type: "article",
      url: `https://genshin-builds.com/tof/blog`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPage() {
  const { data, total } = await getPosts("tof", "en", {
    limit: POSTS_PER_PAGE,
    page: 1,
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
        currentPage={1}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) => `/tof/blog/page/${page}`}
      />
    </div>
  );
}
