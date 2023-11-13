import { BlogPost } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { languages } from "tof-builds";

import { getPosts } from "@lib/blog";
import { getDefaultLocale, getLocale } from "@lib/localData";
import BlogPosts from "../index";

type Props = {
  posts: BlogPost[];
  totalProducts: number;
  currentPage: number;
};

function BlogPostsPage({ posts, totalProducts, currentPage }: Props) {
  return (
    <BlogPosts
      posts={posts}
      totalProducts={totalProducts}
      currentPage={currentPage}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({
  locale = "en",
  params,
}) => {
  if (!params?.page || !Number(params?.page) || Number(params?.page) <= 1) {
    return {
      redirect: {
        destination: `/${locale}/tof/blog`,
        permanent: false,
      },
    };
  }
  const defaultLocale = getDefaultLocale(
    locale,
    languages as unknown as string[]
  );

  const { data, total } = await getPosts("tof", defaultLocale, {
    limit: 12,
    page: Number(params?.page),
  });

  const lngDict = await getLocale(defaultLocale, "tof");

  return {
    props: {
      posts: data,
      totalProducts: total,
      currentPage: params?.page,
      lngDict,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Prerender the next 5 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 2 }).map((_, i) => `/tof/blog/page/${i + 2}`),
    // Block the request for non-generated pages and cache them in the background
    fallback: "blocking",
  };
};

export default BlogPostsPage;
