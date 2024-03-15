import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { submitHSRUID } from "@app/actions";
import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getBuild, getPlayer } from "@lib/hsrShowcase";
import { getHsrUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";
import Builds from "./builds";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  params: {
    uid: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "hsr", "profile");

  const player = await getPlayer(params.uid);

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
    path: `/hsr/showcase/profile/${params.uid}`,
    locale,
  });
}

export default async function HSRProfilePage({ params }: Props) {
  const { langData } = await useTranslations(params.lang, "hsr", "item");

  if (!params.uid || !/^(18|[1-35-9])\d{8}$/.test(params.uid.toString())) {
    return redirect(`/${params.lang}/hsr/showcase`);
  }

  const player = await getPlayer(params.uid);

  if (!player) {
    const formdata = new FormData();
    formdata.append("uid", params.uid);
    const submitRes = await submitHSRUID({}, formdata);
    if (submitRes.message !== "Success") {
      return redirect(`/${params.lang}/hsr/showcase`);
    }
  }

  const res = await getBuild(langData, params?.uid);

  if (res.code !== 200) {
    return redirect(`/${params.lang}/hsr/showcase`);
  }

  const propertiesCommonMap = await getData<
    Record<string, Record<string, string>>
  >("hsr", "properties_common");
  const propertiesCommon = propertiesCommonMap[langData];

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
