import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { SubmitUidForm } from "./submit-uid";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "hsr", "showcase");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail Character Showcase",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Show off your Honkai: Star Rail characters with our character showcase tool. Simply select your character, choose your build, and share your creation with the world.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/showcase`,
    locale,
  });
}

export default async function Page({ params }: Props) {
  const { t } = await useTranslations(params.lang, "hsr", "showcase");

  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "character_showcase",
          defaultMessage: "Character Showcase",
        })}
      </h2>
      <p className="px-4 text-sm">
        {t({
          id: "enter_uid",
          defaultMessage: "Enter UID to view your showcase",
        })}
      </p>
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
