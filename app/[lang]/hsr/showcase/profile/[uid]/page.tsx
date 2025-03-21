import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { submitHSRUID } from "@app/actions";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getBuild, getPlayer } from "@lib/hsrShowcase";
import { getHsrUrl } from "@lib/imgUrl";

import Builds from "./builds";

export const runtime = "edge";

interface Props {
  params: Promise<{
    uid: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, uid } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.profile",
  });

  const player = await getPlayer(uid);

  if (!player) {
    return;
  }

  const title = t("title", { playerUID: player.uuid });
  const description = t("description", { playerUID: player.uuid });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/showcase/profile/${uid}`,
    locale: lang,
  });
}

export default async function HSRProfilePage({ params }: Props) {
  const { lang, uid } = await params;
  const t = await getTranslations("HSR.profile");
  const langData = getLangData(lang, "hsr");

  if (!uid || !/^(18|[1-35-9])\d{8}$/.test(uid.toString())) {
    return redirect(`/${lang}/hsr/showcase`);
  }

  const player = await getPlayer(uid);

  if (!player) {
    const formdata = new FormData();
    formdata.append("uid", uid);
    const submitRes = await submitHSRUID({}, formdata);
    if (submitRes.message !== "Success") {
      return redirect(`/${lang}/hsr/showcase`);
    }
  }

  const res = await getBuild(langData, uid);

  if (res.code !== 200) {
    return redirect(`/${lang}/hsr/showcase`);
  }

  const propertiesCommon = await getHSRData<Record<string, string>>({
    resource: "properties",
    language: "en",
    filter: {
      id: langData,
    },
  });

  const profile = res.data;

  return (
    <div>
      <section className="card relative z-10 flex">
        <div>
          <img
            className="shadow-1 mx-auto rounded-full border-4 border-accent"
            width="100"
            height="100"
            alt="Icon"
            src={getHsrUrl(`/profiles/${profile.profilePictureId}.png`)}
          />
          <div className="font-header py-2 text-center text-2xl font-bold">
            {profile.nickname}
          </div>
        </div>
        <div className="mx-auto grid max-w-xl cursor-default grid-cols-2 gap-2 p-2 pt-2">
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1 truncate">UID</span>
            <span>{profile.uuid}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Trailblaze Lvl</span>
            <span>{profile.level}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Equilibrium Lvl</span>
            <span>{profile.worldLevel}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">{t("achievements")}</span>
            <span>{profile.finishAchievementNum}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">{t("characters")}</span>
            <span>{profile.friends}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">{t("simulated")}</span>
            <span>{profile.passAreaProgress}</span>
          </div>
        </div>
      </section>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <Builds profile={profile} propertiesCommon={propertiesCommon} />
    </div>
  );
}
