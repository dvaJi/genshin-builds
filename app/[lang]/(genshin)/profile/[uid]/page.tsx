import { Profile } from "interfaces/profile";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { submitGenshinUID } from "@app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@app/components/ui/avatar";
import { Badge } from "@app/components/ui/badge";
import { Card, CardContent } from "@app/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@app/components/ui/hover-card";
import { genPageMetadata } from "@app/seo";
import DynamicBackground from "@components/DynamicBackground";
import TimeAgo from "@components/TimeAgo";
import ProfileArtifactsTable from "@components/genshin/ProfileArtifactsTable";
import ProfileBuildsTable from "@components/genshin/ProfileBuildsTable";
import ProfileFavorites from "@components/genshin/ProfileFavorites";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getBuild, getPlayer } from "@lib/genshinShowcase";
import { getUrl, getUrlLQ } from "@lib/imgUrl";

import { FavoriteGenshinProfile } from "./favorite";
import { SyncGenshinProfile } from "./sync";

type Props = {
  params: Promise<{ lang: string; uid: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, uid } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "profile");
  const _player = await getPlayer(uid);

  if (!_player || !_player.length) return undefined;

  const player = _player[0];

  const title = t({
    id: "title",
    defaultMessage: "{name} Genshin Impact Showcase",
    values: { name: player.nickname },
  });
  const description = t({
    id: "description",
    defaultMessage: "Genshin Impact Showcase for {name}",
    values: { name: player.nickname },
  });

  return genPageMetadata({
    title,
    description,
    path: `/profile/${uid}`,
    image: getUrl(`/profile/${player.namecardId}_1.png`),
    locale,
  });
}

export default async function GenshinPlayerProfile({ params }: Props) {
  const { lang, uid } = await params;
  const { langData, locale } = await getTranslations(
    lang,
    "genshin",
    "profile"
  );

  if (!uid || !/^\d{6,10}$/.test(uid.toString())) {
    console.log("Invalid UID", uid);
    return notFound();
  }

  const player = await getPlayer(uid);

  if (!player) {
    console.log("Player not found", uid);
    const formdata = new FormData();
    formdata.append("uid", uid);
    const submitRes = await submitGenshinUID({}, formdata);
    if (submitRes.message !== "Success") {
      return notFound();
    }
  }

  const res = await getBuild(langData, uid);

  if (res.code !== 200 || !res.data) {
    console.log("Build not found", uid);
    return notFound();
  }

  const profile = res.data as Profile;
  const bgImage = getUrlLQ(`/profile/${profile.namecardId}_1.png`);
  const bgGradient = "linear-gradient(rgba(26,28,35,.8),rgb(26, 29, 39) 620px)";

  return (
    <>
      <DynamicBackground
        bgStyle={{ image: bgImage, gradient: { background: bgGradient } }}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />

      <div className="relative z-10">
        <ProfileFavorites />
      </div>

      <Card className="relative z-10 mt-4 overflow-hidden bg-gradient-to-r from-background/95 to-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-0">
          <div
            className="relative h-48 w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${getUrlLQ(`/profile/${profile.namecardId}_1.png`)})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
              <div className="flex items-end gap-4">
                <HoverCard>
                  <HoverCardTrigger>
                    <Avatar className="h-24 w-24 border-4 border-background">
                      <AvatarImage
                        src={getUrl(
                          `/profile/${profile.profileCostumeId || profile.profilePictureId}.png`,
                          142,
                          142
                        )}
                      />
                      <AvatarFallback>
                        {profile.nickname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        {profile.nickname}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.signature}
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <div className="mb-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>UID: {uid}</span>
                    <span>•</span>
                    <TimeAgo date={profile.updatedAt} locale={locale} />
                  </div>
                  <h2 className="text-2xl font-bold text-primary-foreground">
                    {profile.nickname}
                  </h2>
                  <p className="max-w-md text-sm italic text-muted-foreground">
                    {profile.signature}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10"
                >
                  {profile.region}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-500"
                >
                  AR{profile.level}
                </Badge>
                <SyncGenshinProfile lang={lang} uid={uid} />
                <FavoriteGenshinProfile profile={profile} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {profile.builds.length === 0 ? (
        <Card className="relative z-10 mx-auto mt-4 max-w-xl">
          <CardContent className="p-6 text-center text-muted-foreground">
            Please enable the &quot;Show Character Details&quot; option in your
            Character Showcase in-game to see the details.
          </CardContent>
        </Card>
      ) : null}

      <div className="relative z-10 space-y-8 py-8">
        <ProfileBuildsTable data={profile.builds} />

        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />

        <ProfileArtifactsTable data={profile.builds} />
      </div>
    </>
  );
}
