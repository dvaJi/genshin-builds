import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import ProfileFavorites from "@components/genshin/ProfileFavorites";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";

import { SubmitGenshinUidForm } from "./submit-uid";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, locale } = await getTranslations(lang, "genshin", "profile");
  const title = t({
    id: "title",
    defaultMessage: "Genshin Impact Profiles",
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Get the best Genshin Impact profiles to optimize your gameplay. Visualize and compare your player profile with others, calculate crit value, and find the best characters and artifacts.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/profile`,
    locale,
  });
}

export default async function GenshinProfileIndex() {
  // const { t, langData } = await getTranslations(
  //   params.lang,
  //   "genshin",
  //   "profile"
  // );

  return (
    <div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <ProfileFavorites />
      <div className="card flex flex-col items-center justify-center">
        <h2 className="mb-6 text-2xl text-zinc-300">Submit Your UID</h2>
        <SubmitGenshinUidForm />
        <div className="my-4">
          <h3 className="text-xl text-zinc-300">
            How To Get Your Character Build Showcase:
          </h3>
          <ol>
            <li>1. Open Genshin Impact.</li>
            <li>2. Access the Menu.</li>
            <li>3. Click on the edit icon located near your username.</li>
            <li>
              4. Choose &quot;Copy UID&quot; (You may skip this step if you
              remember your UID).
            </li>
            <li>5. Select &quot;Edit Profile&quot;.</li>
            <li>6. Enable the &quot;Show Character Details&quot; option.</li>
            <li>
              7. In the &quot;Character Showcase&quot; column, select the
              characters you&apos;d like to showcase.
            </li>
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
