import clsx from "clsx";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/tof/Image";
import TypeIcon from "@components/tof/TypeIcon";
import { i18n } from "@i18n-config";
import type { Characters } from "@interfaces/tof/characters";
import type { Items } from "@interfaces/tof/items";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";

import ProfileBox from "./profile-box";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Characters[]>("tof", "characters");

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: slugify2(c.name),
      }))
    );
  }

  return routes;
}

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const characters = await getRemoteData<Characters[]>("tof", "characters");
  const character = characters.find((c) => slugify2(c.name) === params.slug);

  if (!character) {
    return;
  }

  const title = `${character.name} - Tower of Fantasy Builds and Wiki Database`;
  const description = `${character.name} is a ${character.rarity} rarity character in Tower of Fantasy. Learn about their skills, talents, builds, and tier list.`;

  return genPageMetadata({
    title,
    description,
    path: `/tof/character/${params.slug}`,
    locale: params.lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const characters = await getRemoteData<Characters[]>("tof", "characters", 0);
  const character = characters.find((c) => slugify2(c.name) === params.slug);

  if (!character) {
    return notFound();
  }
  const items = await getRemoteData<Items[]>("tof", "items", 0);

  const gifts = items
    .filter((item) => {
      const isLikedGift = item.giftTags.some((tagObj) =>
        character.likedGiftTypes.includes(tagObj.tagId)
      );
      const isDislikedGift = item.giftTags.some((tagObj) =>
        character.dislikedGiftTypes.includes(tagObj.tagId as any)
      );
      return isLikedGift && !isDislikedGift;
    })
    .map((item) => {
      const totalMatches = item.giftTags.reduce((acc, curr) => {
        if (character.likedGiftTypes.includes(curr.tagId)) acc++;
        return acc;
      }, 0);

      // Rarity 2~4: Points for 0~3 matches
      const points: { [key: string]: number[] } = {
        "2": [10, 15, 20, 25],
        "3": [20, 30, 40, 50],
        "4": [40, 60, 80, 100],
      };

      return { ...item, amount: `+${points[item.rarity][totalMatches]}` };
    })
    .sort((a, b) => Number(b.amount) - Number(a.amount));

  // function uniqBy<T>(array: T[], iteratee: (value: T) => any): T[] {
  //   const seen = new Set();
  //   return array.filter((item) => {
  //     const key = iteratee(item);
  //     if (seen.has(key)) {
  //       return false;
  //     } else {
  //       seen.add(key);
  //       return true;
  //     }
  //   });
  // }

  // const uniqGiftTags = uniqBy(
  //   gifts.flatMap((item) => item.giftTags),
  //   (tagObj) => tagObj.tagId
  // );
  // const preferredGiftTags = character.likedGiftTypes.map(
  //   (tagId) =>
  //     uniqGiftTags.find(
  //       (obj) => obj.tagId.toLowerCase() === tagId.toLowerCase()
  //     ) ?? { tagId }
  // );

  return (
    <div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex w-full  flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Image
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={`/characters/portrait_${character.id}.png`}
            alt={character.name}
            width={192}
            height={192}
          />
          <div className="">
            <h2 className="text-tof-50 mb-4 text-2xl font-bold lg:text-4xl">
              {character.name}
            </h2>
            <span
              className={clsx("text-xl font-bold", {
                "text-purple-500": character.rarity === 4,
                "text-yellow-200": character.rarity === 5,
              })}
            >
              {character.rarity === 4 ? "SR" : "SSR"}
            </span>
            <span className="ml-2 text-xl uppercase">Simulacrum</span>
          </div>
        </div>
        <div className="mx-4 flex w-full flex-row-reverse items-center justify-between lg:w-auto">
          <Image
            src={`/weapons/icon_${character.weaponId}.png`}
            className="h-24 w-24"
            alt={character.weaponId}
            width={96}
            height={96}
          />
          <div>
            <h2 className="text-tof-50 mb-4 text-xl font-bold lg:text-3xl">
              {character.weapon.name}
            </h2>
            <div className="flex justify-between">
              <div className="flex items-center">
                <TypeIcon type={character.weapon.element} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.weapon.element}
                </span>
              </div>
              <div className="flex items-center">
                <TypeIcon type={character.weapon.category} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.weapon.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-10 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Part of a set
          </h2>
          <div className="flex rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            <Link
              href={`/tof/character/${slugify2(character.name)}`}
              className="hover:bg-tof-600 flex flex-col items-center rounded-lg p-4"
              prefetch={false}
            >
              <Image
                className="h-24 w-24"
                src={`/characters/portrait_${character.id}.png`}
                alt={character.name}
                width={96}
                height={96}
              />
              <h3 className="text-tof-50 text-xl">{character.name}</h3>
            </Link>
            <Link
              href={`/tof/weapons/${slugify2(character.weapon.name)}`}
              className="hover:bg-tof-600 flex flex-col items-center rounded-lg p-4"
              prefetch={false}
            >
              <Image
                src={`/weapons/icon_${character.weaponId}.png`}
                className="h-24 w-24"
                alt={character.weaponId}
                width={96}
                height={96}
              />
              <h3 className="text-tof-50 text-xl">{character.weapon.name}</h3>
            </Link>
            <Link
              href={`/tof/matrices/${slugify2(character.matrix.name)}`}
              className="hover:bg-tof-600 flex flex-col items-center rounded-lg p-4"
              prefetch={false}
            >
              <Image
                src={`/matrices/icon_${character.matrixId}.png`}
                className="h-24 w-24"
                alt={character.matrix.name}
                width={96}
                height={96}
              />
              <h3 className="text-tof-50 text-xl">{character.matrix.name}</h3>
            </Link>
          </div>
        </div>
        <div className="mb-10 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Awakening
          </h2>
          <div className="rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            {character.awakening
              .filter((a) => a.description)
              .map((trait, index) => (
                <div key={trait.name} className="mb-4">
                  <h3 className="text-tof-50 text-xl font-bold">
                    {trait.name}
                  </h3>
                  <div className="bg-tof-900 mr-4 w-36 rounded px-2 text-yellow-100">
                    {index === 0 ? "1200 Awakening" : "4000 Awakening"}
                  </div>
                  <div
                    className="text text-tof-300"
                    dangerouslySetInnerHTML={{
                      __html: trait.description ?? "",
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-8 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Preferred Gifts
          </h2>
          <div className="flex flex-col rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            {/* <ul className="g-50 flex flex-wrap">
              {preferredGiftTags.map((tag) => (
                <li key={tag.tagId}>
                  <div
                    className={clsx(
                      "m-1 rounded shadow",
                      `TOF-bg-${tag.tagId}`
                    )}
                  >
                    {tag?.name}
                  </div>
                </li>
              ))}
            </ul> */}
            <ul className="g-50 flex flex-wrap">
              {gifts.map((tag) => (
                <li key={tag.id}>
                  <div
                    className={clsx(
                      "relative m-1 rounded shadow",
                      `TOF-bg-${tag.rarity}`
                    )}
                  >
                    <Image
                      className="h-16 w-16 lg:h-24 lg:w-24"
                      src={`/items/${tag.id}.png`}
                      title={tag.name}
                      alt={tag.name}
                      width={96}
                      height={96}
                    />
                    <span className="absolute bottom-0 right-1 font-semibold text-white shadow-black text-shadow">
                      {tag.amount}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-8 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">Profile</h2>
          <div className="flex gap-4 rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            <ProfileBox label="Title" value={character.weapon.name} />
            <ProfileBox label="Gender" value={character.gender} />
            <ProfileBox label="Allegiance" value={character.homeTown} />
            <ProfileBox label="Height" value={character.height} />
            <ProfileBox label="Birthdate" value={character.birthday} />
          </div>
        </div>

        <div className="mb-8 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Voice Actors
          </h2>
          <div className="flex gap-4 rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            <ProfileBox label="English" value={character.voicing.en} />
            <ProfileBox label="Chinese" value={character.voicing.cn} />
            <ProfileBox label="Japanese" value={character.voicing.jp} />
            <ProfileBox label="Korean" value={character.voicing.kr} />
            <ProfileBox label="Portuguese" value={character.voicing.pt} />
          </div>
        </div>
      </div>
    </div>
  );
}
