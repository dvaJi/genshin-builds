import type { Metadata } from "next";

import BlogPostCard from "@components/zenless/BlogPostCard";
import Pagination from "@components/zenless/Pagination";
import { getPosts } from "@pages/api/blog/list";

const POSTS_PER_PAGE = 10;

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest news and updates from ZenlessBuilds.",
};

// export const generateStaticParams = async () => {
//   const totalPages = Math.ceil(allBlogs.length / POSTS_PER_PAGE)
//   const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

//   return paths
// }

export default async function BlogPage({
  params,
}: {
  params: { page: string };
}) {
  const currentPage = Number(params.page) || 1;
  const { data, total } = await getPosts("zenless", "en", {
    limit: POSTS_PER_PAGE,
    page: currentPage,
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
        currentPage={currentPage}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) =>
          page === 1 ? "/zenless/blog" : `/zenless/blog/page/${page}`
        }
      />
    </div>
  );
}
