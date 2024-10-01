import { i18n } from "i18n-config";
import importDynamic from "next/dynamic";
import Link from "next/link";

import NewsPostCard from "@components/zenless/NewsPostCard";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getNews } from "@lib/news";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

type Props = {
  params: {
    lang: string;
  };
};

export default async function Page({ params }: Props) {
  const data = await getNews("zenless-zone-zero");

  return (
    <div className="relative">
      <h1 className="text-6xl font-semibold">Welcome to ZenlessBuilds</h1>
      <p>
        Discover character builds, comprehensive guides, and a wiki database all
        in one place for Zenless Zone Zero (ZZZ).
      </p>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mt-6">
        <h2 className="text-3xl font-semibold">News</h2>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {data?.map((post) => <NewsPostCard key={post.title} post={post} />)}
        </div>
        <div className="mt-4">
          <Link
            href={`/${params.lang}/zenless/blog`}
            className="rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4"
            prefetch={false}
          >
            See more
          </Link>
        </div>
      </div>
    </div>
  );
}
