import { BlogPost } from "@prisma/client";
import { GetStaticProps } from "next";

import Metadata from "@components/Metadata";
import BlogPostCard from "@components/genshin/BlogPostCard";
import Pagination from "@components/genshin/Pagination";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { getPosts } from "@lib/blog";

type Props = {
  posts: BlogPost[];
  totalProducts: number;
  currentPage: number;
};

function BlogPosts({ posts, totalProducts, currentPage }: Props) {
  const { t } = useIntl("blog");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Blog",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Stay up-to-date with Genshin Impact news, guides, and tips. Explore the Genshin Impact Blog for the latest updates and valuable insights to enhance your gaming experience.",
        })}
      />
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {posts.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={totalProducts}
        currentPage={currentPage}
        itemsPerPage={1}
        renderPageLink={(page) => `/genshin/blog/page/${page}`}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { data, total } = await getPosts("genshin", locale as string, {
    limit: 10,
    page: 1,
  });

  const lngDict = await getLocale(locale, "genshin");

  return {
    props: {
      posts: data,
      totalProducts: total,
      currentPage: 1,
      lngDict,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default BlogPosts;
