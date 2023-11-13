import type { Metadata } from "next";

import { getPosts } from "@lib/blog";
import BlogPostCard from "@components/zenless/BlogPostCard";
import Pagination from "@components/zenless/Pagination";

const POSTS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news and updates from ZenlessBuilds.",
};

export default async function BlogPage() {
  const { data, total } = await getPosts("zenless", "en", {
    limit: POSTS_PER_PAGE,
    page: 1,
  });

  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {data.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={total}
        currentPage={1}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) => `/zenless/blog/page/${page}`}
      />
    </div>
  );
}
