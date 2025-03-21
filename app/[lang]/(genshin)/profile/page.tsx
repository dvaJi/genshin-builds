import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { genPageMetadata } from "@app/seo";
import ProfileFavorites from "@components/genshin/ProfileFavorites";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { SubmitGenshinUidForm } from "./submit-uid";


type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.profile",
  });
  const title = t("title");
  const description = t("description");

  return genPageMetadata({
    title,
    description,
    path: `/profile`,
    locale: lang,
  });
}

export default async function GenshinProfileIndex() {
  const t = await getTranslations("Genshin.profile");

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <ProfileFavorites />
      <div className="card flex flex-col items-center justify-center">
        <h2 className="mb-6 text-2xl text-zinc-300">{t("title")}</h2>
        <SubmitGenshinUidForm />
        <div className="my-4">
          <h3 className="text-xl text-zinc-300">
            {t("how_to_showcase_characters")}
          </h3>
          <ol>
            <li>{t("how_to_showcase_characters_1")}</li>
            <li>{t("how_to_showcase_characters_2")}</li>
            <li>{t("how_to_showcase_characters_3")}</li>
            <li>{t("how_to_showcase_characters_4")}</li>
            <li>{t("how_to_showcase_characters_5")}</li>
            <li>{t("how_to_showcase_characters_6")}</li>
            <li>{t("how_to_showcase_characters_7")}</li>
          </ol>
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
