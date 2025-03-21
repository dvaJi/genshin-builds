import type { Metadata } from "next";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import type { Characters } from "@interfaces/tof/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

import CharactersList from "./characters";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
export const runtime = "edge";

export async function generateStaticParams() {
  return [];
}

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
        <h2 className="text-2xl text-tof-100">Tower of Fantasy Characters</h2>
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
