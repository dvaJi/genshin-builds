import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

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

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(
    params.lang,
    "genshin",
    "sheets_tools"
  );
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/sheets-tools`,
    locale,
  });
}

export default async function GenshinSheetsTools({ params }: Props) {
  const { t } = await useTranslations(params.lang, "genshin", "sheets_tools");

  const sheets = await getData<Record<string, GenshinImpactCalculators>>(
    "genshin",
    "sheets-tools"
  );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t("sheets_tools")}
      </h2>
      <p>{t("sheets_tools_desc")}</p>
      <div className="mx-2 grid gap-4 md:mx-0 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(sheets).map(([key, value]) => (
          <div key={key} className="card my-6">
            <img
              src={getUrl(value.images[0], 300, 480, 0, true)}
              alt={value.name}
              className="h-auto w-full"
            />
            <div className="flex flex-col justify-between">
              <Link href={`/sheets-tools/${key}`}>
                <h3 className="py-4 text-xl font-semibold text-gray-200">
                  {value.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-300">{value.purpose}</p>
              <div className="mt-4 flex flex-wrap">
                {value.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="mr-2 rounded bg-gray-800 px-2 py-1 text-sm text-gray-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm italic">
        If you want to add or update a tool, please notify us by openning an{" "}
        <a
          className="underline"
          href="https://github.com/dvaJi/genshin-builds/issues"
        >
          issue
        </a>{" "}
        based on{" "}
        <a
          className="underline"
          href="https://github.com/dvaJi/genshin-builds/blob/master/_content/genshin/data/sheets-tools.json"
        >
          this file
        </a>
        .
      </p>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
