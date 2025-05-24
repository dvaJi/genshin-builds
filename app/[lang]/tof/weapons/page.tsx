import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Image from "@components/tof/Image";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import type { Weapons } from "@interfaces/tof/weapons";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
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
  const data = await getRemoteData<Weapons[]>("tof", "weapons");

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-tof-100">Tower of Fantasy Weapons</h2>
        <p>
          Discover the best weapons in Tower of Fantasy and their builds ranked
          in order of power, viability, and versatility to clear content.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="grid grid-cols-9 rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
        {data.map((weapon) => (
          <Link
            key={weapon.id}
            href={`/tof/weapons/${slugify2(weapon.name)}`}
            className="flex flex-col items-center justify-center rounded-lg p-4 hover:bg-tof-600"
            prefetch={false}
          >
            <Image
              className="h-24 w-24"
              src={`/weapons/icon_${weapon.id}.png`}
              alt={weapon.name}
              width={96}
              height={96}
            />
            <h3 className="text-center text-xl text-tof-50">{weapon.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
