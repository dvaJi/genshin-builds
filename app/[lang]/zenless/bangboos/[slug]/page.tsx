import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.bangboo",
  });
  const langData = getLangData(lang, "zenless");

  const bangboo = await getZenlessData<Bangboos>({
    resource: "bangboos",
    filter: { id: slug },
    language: langData,
  });

  if (!bangboo) {
    return;
  }

  const title = t("title", {
    bangboo: bangboo.name,
  });
  const description = t("description", {
    bangboo: bangboo.name,
  });
  const image = `/zenless/bangboos/${bangboo.icon}.webp`;

  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return genPageMetadata({
    title,
    description,
    image: ogImage,
    path: `/zenless/bangboos/${slug}`,
    locale: lang,
  });
}

export default async function BangbooPage({ params }: Props) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.bangboo");
  const langData = getLangData(lang, "zenless");
  const bangboo = await getZenlessData<Bangboos>({
    resource: "bangboos",
    filter: { id: slug },
    language: langData,
  });

  if (!bangboo) {
    return notFound();
  }

  return (
    <div className="mx-2 max-w-screen-lg md:mx-auto">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row">
        <Image
          src={`/bangboos/${bangboo.icon}.webp`}
          width={200}
          height={200}
          alt={bangboo.name}
          className="mx-auto w-48 sm:mx-0 sm:w-auto"
        />
        <div className="text-center sm:text-left">
          <h1 className="mb-2 text-3xl font-semibold md:text-5xl">
            {bangboo.name} - {t("main_title")}
          </h1>
          <div className="space-y-1 text-sm md:text-base">
            <p>
              <b>{t("rarity")}</b>:{" "}
              <Image
                src={`/icons/rank_${bangboo.rarity}.png`}
                width={24}
                height={24}
                alt={bangboo.rarity >= 4 ? "S" : "A"}
                className="inline"
              />{" "}
              {t("rank")}
            </p>
          </div>
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mt-4 space-y-4 md:mt-6">
        {Object.values(bangboo.skills).map((skill, i) => (
          <div
            key={skill.name + i}
            className="flex flex-col gap-4 rounded-lg border-2 border-zinc-950 p-3 sm:flex-row md:p-4"
          >
            <div className="flex flex-row items-center gap-2 sm:w-[120px] sm:min-w-[120px] sm:flex-col">
              <Image
                className="h-10 w-10 sm:h-12 sm:w-12"
                src={`/icons/bangboo_${i === 0 ? "a" : i === 1 ? "b" : "c"}.png`}
                alt={skill.name}
                width={48}
                height={48}
              />
              <h4 className="text-sm font-semibold md:text-base">
                {skill.name}
              </h4>
            </div>
            <div className="flex-1">
              <p
                className="whitespace-pre-line text-sm text-neutral-200 md:text-base"
                dangerouslySetInnerHTML={{ __html: skill.description }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
