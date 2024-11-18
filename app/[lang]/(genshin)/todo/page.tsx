import { i18n } from "i18n-config";
import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import TodoLazy from "@components/genshin/TodoLazy";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Domains } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getAllMaterialsMap } from "@utils/materials";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({
    lang,
  }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "todo");
  const title = t({
    id: "title",
    defaultMessage: "Todo List",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Todo List for Genshin Impact to plan and track resources you need!",
  });

  return genPageMetadata({
    title,
    description,
    path: `/todo`,
    locale,
  });
}

export default async function GenshinTodo({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(lang, "genshin", "todo");

  const materialsMap = await getAllMaterialsMap(langData);
  const domains = await getGenshinData<Domains>({
    resource: "domains",
    language: langData,
  });
  const planning = [...domains.characters, ...domains.weapons].reduce<
    Record<string, string[]>
  >((acc, cur) => {
    const { rotation } = cur;

    rotation.forEach(({ day, ids }) => {
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(...ids);
    });

    return acc;
  }, {});
  const days = domains.characters[0].rotation.map((r) => r.day);

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "todo", defaultMessage: "Todo List" })}
      </h2>
      <TodoLazy materialsMap={materialsMap} planning={planning} days={days} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
