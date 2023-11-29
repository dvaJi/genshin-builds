import dynamic from "next/dynamic";
import Link from "next/link";

import BlogPostCard from "@components/zenless/BlogPostCard";
import { getPosts } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: {
    lang: string;
  };
};

export default async function Page({ params }: Props) {
  const { data } = await getPosts("zenless", "en", {
    limit: 3,
    page: 1,
  });

  return (
    <div>
      <h1 className="text-6xl font-semibold">Welcome to ZenlessBuilds</h1>
      <p>
        Discover character builds, comprehensive guides, and a wiki database all
        in one place.
      </p>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mt-6">
        <h2 className="text-3xl font-semibold">News</h2>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {data.map((post) => (
            <BlogPostCard key={post.title} post={post} />
          ))}
        </div>
        <div className="mt-4">
          <Link
            href={`/${params.lang}/zenless/blog`}
            className="rounded-2xl border-2 border-black px-4 py-2 font-semibold ring-black transition-all hover:bg-white hover:ring-4"
          >
            See more
          </Link>
        </div>
      </div>
    </div>
  );
}
