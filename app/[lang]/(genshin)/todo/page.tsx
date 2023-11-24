import GenshinData from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getAllMaterialsMap } from "@utils/materials";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

const Todo = dynamic(() => import("@components/genshin/Todo"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "genshin", "todo");
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
  const { t, langData } = await useTranslations(params.lang, "genshin", "todo");

  const genshinData = new GenshinData({ language: langData as any });
  const materialsMap = await getAllMaterialsMap(genshinData);
  const domains = await genshinData.domains();
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
      <Todo materialsMap={materialsMap} planning={planning} days={days} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
