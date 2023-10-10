import { BlogPost } from "@prisma/client";
import { GetStaticProps } from "next";

import BlogPostCard from "@components/genshin/BlogPostCard";
import Pagination from "@components/genshin/Pagination";
import { getLocale } from "@lib/localData";
import { getPosts } from "@pages/api/blog/list";

type Props = {
  posts: BlogPost[];
  totalProducts: number;
  currentPage: number;
};

function BlogPosts({ posts, totalProducts, currentPage }: Props) {
  return (
    <div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {posts.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={totalProducts}
        currentPage={currentPage}
        itemsPerPage={1}
        renderPageLink={(page) => `/genshin/archives/page/${page}`}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { data, total } = await getPosts("genshin", locale as string, {
    limit: 10,
    page: 1,
    fmOnly: true,
  });

  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      posts: data,
      totalProducts: total,
      currentPage: 1,
      lngDict,
    },
  };
};

export default BlogPosts;
