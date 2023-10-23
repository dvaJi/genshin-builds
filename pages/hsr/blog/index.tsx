import { BlogPost } from "@prisma/client";
import { GetStaticProps } from "next";

import Metadata from "@components/Metadata";
import BlogPostCard from "@components/hsr/BlogPostCard";
import Pagination from "@components/hsr/Pagination";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { getPosts } from "@pages/api/blog/list";

type Props = {
  posts: BlogPost[];
  totalProducts: number;
  currentPage: number;
};

function BlogPosts({ posts, totalProducts, currentPage }: Props) {
  const { t } = useIntl("blog");

  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail Blog",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "The Honkai: Star Rail Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Honkai: Star Rail.",
        })}
      />
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "blog",
          defaultMessage: "Blog",
        })}
      </h2>
      <p className="px-1 text-sm">
        {t({
          id: "blog_desc",
          defaultMessage:
            "The Honkai: Star Rail Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Honkai: Star Rail.",
        })}
      </p>
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {posts.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={totalProducts}
        currentPage={currentPage}
        itemsPerPage={12}
        renderPageLink={(page) => `/hsr/blog/page/${page}`}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { data, total } = await getPosts("hsr", locale as string, {
    limit: 12,
    page: 1,
  });

  const lngDict = await getLocale(locale, "hsr");

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
