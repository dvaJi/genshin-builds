import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import NewsPostCard from "@components/zenless/NewsPostCard";
import { routing } from "@i18n/routing";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getNews } from "@lib/news";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{
    lang: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.home",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/zenless`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.home");
  const data = await getNews("zenless-zone-zero");

  return (
    <div className="relative">
      <h1 className="text-6xl font-semibold">{t("welcome")}</h1>
      <p>{t("welcome_description")}</p>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mt-6">
        <h2 className="text-3xl font-semibold">{t("news")}</h2>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {data?.map((post) => <NewsPostCard key={post.title} post={post} />)}
        </div>
        <div className="mt-4">
          <Link
            href={`/${lang}/zenless/blog`}
            className="rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4"
            prefetch={false}
          >
            {t("see_more")}
          </Link>
        </div>
      </div>
    </div>
  );
}
