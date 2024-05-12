import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import type { Characters } from "@interfaces/tof/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

import CharactersList from "./characters";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export async function generateMetadata(): Promise<Metadata | undefined> {
  const title = "Tower of Fantasy Characters - ToF-Builds.com Wiki Database";
  const description =
    "All the best characters and their builds ranked in order of power, viability, and versatility to clear content.";
  return genPageMetadata({
    title,
    description,
    path: `/tof`,
  });
}

export default async function TOFPage() {
  const data = await getRemoteData<Characters[]>("tof", "characters");

  return (
    <div>
      <div className="my-2">
        <h2 className="text-tof-100 text-2xl">Tower of Fantasy Characters</h2>
        <p>
          Discover character builds, comprehensive guides, and a wiki database
          all in one place.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <CharactersList characters={data} />
    </div>
  );
}
