import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import BlogPostCard from "@components/hsr/BlogPostCard";
import Pagination from "@components/hsr/Pagination";
import useTranslations from "@hooks/use-translations";
import { getPosts } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const POSTS_PER_PAGE = 12;

type Props = {
  params: {
    page: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const currentPage = Number(params.page) || 1;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations("hsr", "blog");

  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Blog",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "The Honkai: Star Rail Blog is a place where you can find the latest news and updates about the game. We also post guides, tips, and tricks to help you get started with Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/blog/page/${currentPage}`,
    locale,
  });
}

export default async function BlogPage({ params }: Props) {
  const { t } = await useTranslations("hsr", "blog");
  const currentPage = Number(params.page) || 1;
  const { data, total } = await getPosts("hsr", "en", {
    limit: POSTS_PER_PAGE,
    page: currentPage,
  });

  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
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
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
        {data.map((post) => (
          <BlogPostCard key={post.title} post={post} />
        ))}
      </div>
      <Pagination
        totalItems={total}
        currentPage={currentPage}
        itemsPerPage={POSTS_PER_PAGE}
        renderPageLink={(page) =>
          page === 1 ? "/hsr/blog" : `/hsr/blog/page/${page}`
        }
      />
    </div>
  );
}
