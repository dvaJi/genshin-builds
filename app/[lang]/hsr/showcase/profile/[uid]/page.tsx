import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { submitHSRUID } from "@app/actions";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getBuild, getPlayer } from "@lib/hsrShowcase";
import { getHsrUrl } from "@lib/imgUrl";

import Builds from "./builds";

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
  const { t, locale } = await getTranslations(lang, "hsr", "profile");

  const player = await getPlayer(uid);

  if (!player) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail {playerUID} Player Profile",
    values: { playerUID: player.uuid },
  });
  const description = t({
    id: "description",
    defaultMessage: "Honkai: Star Rail {playerUID} Player Profile",
    values: {
      playerUID: player.uuid,
    },
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/showcase/profile/${uid}`,
    locale,
  });
}

export default async function HSRProfilePage({ params }: Props) {
  const { lang, uid } = await params;
  const { langData } = await getTranslations(lang, "hsr", "item");

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
      <section className="relative z-10 flex bg-hsr-surface1 p-4 shadow-2xl">
        <div>
          <img
            className="shadow-1 mx-auto rounded-full border-4 border-hsr-accent"
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
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1 truncate">UID</span>
            <span>{profile.uuid}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Trailblaze Lvl</span>
            <span>{profile.level}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Equilibrium Lvl</span>
            <span>{profile.worldLevel}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Achievements</span>
            <span>{profile.finishAchievementNum}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Characters</span>
            <span>{profile.friends}</span>
          </div>
          <div className="shadow-1 flex items-center justify-between gap-1 rounded-md border border-hsr-surface3 bg-hsr-bg px-2 py-1.5 text-xs font-bold shadow-sm">
            <span className="text-1">Simulated</span>
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
