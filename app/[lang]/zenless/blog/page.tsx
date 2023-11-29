import type { Metadata } from "next";
import dynamic from "next/dynamic";

import BlogPostCard from "@components/zenless/BlogPostCard";
import Pagination from "@components/zenless/Pagination";
import { getPosts } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const POSTS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news and updates from ZenlessBuilds.",
};

export default async function BlogPage({
  params,
}: {
  params: { lang: string };
}) {
  const { data, total } = await getPosts("zenless", "en", {
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
        renderPageLink={(page) => `/${params.lang}/zenless/blog/page/${page}`}
      />
    </div>
  );
}
