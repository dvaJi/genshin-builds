import { getUniqueListBy } from "@utils/unique-by";
import fs from "fs";
import { join } from "path";

export interface GiCustomMap {
  imageOverlay: string;
  markIcon: string;
  marks: number[][];
}

export interface Guide {
  title: string;
  description: string;
  slug: string;
  type: string;
  tags: string[];
  date: string;
  version: string;
  thumbnail: string;
  timeAgo: string;
  relatedGuides: Guide[];
  ytVideosUrl?: string[];
  giMapIDs?: string[];
  giCustomMap?: GiCustomMap;
}

const guidesDirectory = join(process.cwd(), "_content", "guides");

export function getAllGuides(locale: string): Guide[] {
  const guidesDir = fs.readdirSync(guidesDirectory);

  return guidesDir
    .map((guide) => {
      const guideJson = require(`../_content/guides/${guide}`);
      return normalizeGuide(guideJson, guide, locale);
    })
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else if (a.date > b.date) {
        return -1;
      } else {
        return 0;
      }
    });
}

export function getGuideByTag(tag: string, locale: string): Guide[] {
  return getAllGuides(locale).filter((guide) => guide.tags.includes(tag));
}

export function getGuideBySlug(slug: string, locale: string): Guide {
  const guidePath = join(guidesDirectory, `${slug}.json`);
  const guideData = fs.readFileSync(guidePath, "utf8");
  const guideJson = JSON.parse(guideData);

  const relatedGuides = guideJson.tags.flatMap((tag: string) => {
    const guides = getGuideByTag(tag, locale);
    return guides.map((guide) => normalizeGuide(guide, guide.slug, locale));
  });
  return normalizeGuide(
    {
      ...guideJson,
      relatedGuides: getUniqueListBy<Guide>(relatedGuides, "slug").filter(
        (guide) => guide.slug !== slug
      ),
    },
    slug,
    locale
  );
}

function normalizeGuide(guide: any, slug: string, locale: string): Guide {
  return {
    ...guide,
    title:
      typeof guide.title === "string"
        ? guide.title
        : guide.title[locale] || guide.title["en"],
    description:
      typeof guide.description === "string"
        ? guide.description
        : guide.description[locale] || guide.description["en"],
    slug: slug.replace(".json", ""),
    path: slug,
  };
}
