import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { routing } from "@i18n/routing";
import type { Code } from "@interfaces/zenless/code";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

export const dynamic = "force-static";
export const revalidate = 43200;
export const runtime = "edge";

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.codes",
  });

  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/zenless/tierlist`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.codes");
  const codes = await getZenlessData<Code[]>({
    resource: "codes",
  });

  return (
    <div>
      <div className="my-2">
        <h1 className="text-4xl font-semibold">{t("codes_title")}</h1>
        <p>
          {t("codes_description", {
            current_year: new Date().getFullYear(),
          })}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <h2 className="text-2xl font-semibold">{t("what_are_codes")}</h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        <p>{t("what_are_codes_description")}</p>
      </div>
      <h2 className="text-2xl font-semibold">{t("latest_codes")}</h2>
      <p>{t("latest_codes_description")}</p>
      <div className="relative mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {codes
          ?.filter((c) => c.isValid)
          .map((code) => (
            <div
              key={code.id}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <a
                href={`https://zenless.hoyoverse.com/redemption?code=${code.id}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-yellow-400"
              >
                {code.id}
              </a>
              - {code.description}
            </div>
          ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">{t("how_to_redeem_codes")}</h2>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        <ul>
          <li>{t("how_to_redeem_codes_1")}</li>
          <li>{t("how_to_redeem_codes_2")}</li>
          <li>{t("how_to_redeem_codes_3")}</li>
          <li>{t("how_to_redeem_codes_4")}</li>
          <li>{t("how_to_redeem_codes_5")}</li>
          <li>{t("how_to_redeem_codes_6")}</li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold">{t("expired_codes")}</h2>
      <p>{t("expired_codes_description")}</p>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {codes
          ?.filter((c) => !c.isValid)
          .map((code) => (
            <div
              key={code.id}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <a
                href={`https://zenless.hoyoverse.com/redemption?code=${code.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-yellow-500"
              >
                {code.id}
              </a>
              - {code.description}
            </div>
          ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-2xl font-semibold">{t("faq")}</h2>
      <ul>
        <li>
          <b>{t("faq_1")}</b>
          <br />
          {t("faq_1_answer")}
        </li>
        <li>
          <b>{t("faq_2")}</b>
          <br />
          {t("faq_2_answer")}
        </li>
      </ul>
    </div>
  );
}
