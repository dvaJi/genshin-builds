import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import Badge from "@components/ui/Badge";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { i18n } from "@i18n-config";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";

export const dynamic = "force-static";

interface GenshinImpactCalculators {
  name: string;
  purpose: string;
  url: string;
  categories: string[];
  tags: string[];
  images: string[];
  creator?: string;
  hoyolab?: string;
}

export async function generateStaticParams() {
  const sheets = await getData<Record<string, GenshinImpactCalculators>>(
    "genshin",
    "sheets-tools"
  );
  const routes: { lang: string; tool: string }[] = [];

  for await (const lang of i18n.locales) {
    for (const tool of Object.keys(sheets)) {
      routes.push({ lang, tool });
    }
  }
  return routes;
}

interface Props {
  params: Promise<{
    tool: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, tool } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "sheets_tools");

  const sheets = await getData<Record<string, GenshinImpactCalculators>>(
    "genshin",
    "sheets-tools"
  );
  const sheet = sheets[tool];

  if (!sheet) {
    return;
  }

  const title = t("detail_title", {
    name: sheet.name,
    category: sheet.categories[0],
  });
  const description = sheet.purpose;

  return genPageMetadata({
    title,
    description,
    path: `/sheets-tools/${tool}`,
    locale,
  });
}

export default async function GenshinSheetsToolsPage({ params }: Props) {
  const { lang, tool } = await params;
  const { t } = await getTranslations(lang, "genshin", "sheets_tools");
  const sheets = await getData<Record<string, GenshinImpactCalculators>>(
    "genshin",
    "sheets-tools"
  );
  const sheet = sheets[tool];

  if (!sheet) {
    return notFound();
  }

  return (
    <div className="relative">
      <h2 className="text-2xl font-semibold text-gray-200">
        {t("detail_title", {
          name: sheet.name,
          category: sheet.categories[0],
        })}
      </h2>
      <p>{sheet.purpose}</p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="card">
        <div>
          <ul className="flex flex-wrap gap-4">
            {sheet.images.map((image) => (
              <li key={image}>
                <img
                  src={getUrl(image, 300, 480)}
                  alt={sheet.name}
                  className="rounded-lg"
                  width={300}
                  height={480}
                />
              </li>
            ))}
          </ul>
        </div>
        <p>
          {t("creator")}: {sheet.creator}
        </p>
        <p>
          {t("link")}:{" "}
          <a href={sheet.url} target="_blank" rel="noreferrer noopener">
            {sheet.url}
          </a>
        </p>
        {sheet.hoyolab ? (
          <p>
            {t("hoyolab_article")}:{" "}
            <a href={sheet.hoyolab} target="_blank" rel="noreferrer noopener">
              {sheet.hoyolab}
            </a>
          </p>
        ) : null}
        <div>
          <h4>{t("categories")}:</h4>
          <ul>
            {sheet.categories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))}
          </ul>
        </div>
        <div>
          <h4>{t("tags")}:</h4>
          <ul>
            {sheet.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </ul>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
