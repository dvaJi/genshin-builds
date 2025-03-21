import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { SubmitUidForm } from "./submit-uid";


type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.showcase",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/hsr/showcase`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.showcase");

  return (
    <div className="card">
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t("character_showcase")}
      </h2>
      <p className="px-4 text-sm">{t("enter_uid")}</p>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 lg:min-h-[500px]">
        <SubmitUidForm />
      </div>
    </div>
  );
}
