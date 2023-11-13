import { BlogPost } from "@prisma/client";
import { GetStaticProps } from "next";
import { languages } from "tof-builds";

import { getPosts } from "@lib/blog";
import Metadata from "@components/Metadata";
import BlogPostCard from "@components/tof/BlogPostCard";
import Pagination from "@components/tof/Pagination";
import useIntl from "@hooks/use-intl";
import { getDefaultLocale, getLocale } from "@lib/localData";

type Props = {
  posts: BlogPost[];
  totalProducts: number;
  currentPage: number;
};

function BlogPosts({ posts, totalProducts, currentPage }: Props) {
  const { t } = useIntl("blog");

  return (
    <div className="bg-tof-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Tower of Fantasy Blog",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "The Tower of Fantasy Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Tower of Fantasy.",
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
            "The Tower of Fantasy Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Tower of Fantasy.",
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
        renderPageLink={(page) => `/tof/blog/page/${page}`}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const defaultLocale = getDefaultLocale(
    locale,
    languages as unknown as string[]
  );

  const { data, total } = await getPosts("tof", defaultLocale as string, {
    limit: 12,
    page: 1,
  });

  const lngDict = await getLocale(defaultLocale, "tof");

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
