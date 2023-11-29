import { getPosts } from "@lib/blog";
import { getRemoteData } from "@lib/localData";
import GenshinData from "genshin-data";
import HSRData from "hsr-data";
import { i18n } from "i18n-config";
import TOFData from "tof-builds";

type Route = {
  url: string;
  lastModified: string;
};
const baseDomain = "https://genshin-builds.com";

export default async function sitemap() {
  const routes: Route[] = [];

  const genshinRoutes = await getGenshinSpecificRoutes();
  routes.push(...genshinRoutes);

  const hsrRoutes = await getHSRSpecificRoutes();
  routes.push(...hsrRoutes);

  const tofRoutes = await getTOFSpecificRoutes();
  routes.push(...tofRoutes);

  const zenlessRoutes = await getZenlessSpecificRoutes();
  routes.push(...zenlessRoutes);

  return routes;
}

async function getGenshinSpecificRoutes() {
  const giData = new GenshinData();
  const characters = await giData.characters();
  const weapons = await giData.weapons();
  const tcg = await giData.tcgCards();

  const routes: Route[] = [];

  [
    "",
    "/achievements",
    "/artifacts",
    "/banners/characters",
    "/banners/weapons",
    "/calculator",
    "/changelog",
    "/characters",
    "/contact",
    "/fishing",
    "/food",
    "/genshin/blog",
    "/genshin/blog/page/2",
    "/ingredients",
    "/leaderboard",
    "/materials",
    "/potions",
    "/privacy-policy",
    "/profile",
    "/tcg",
    "/tcg/best-decks",
    "/teams",
    "/tier-list",
    "/tier-list-weapons",
    "/todo",
    "/weapons",
  ].forEach((route) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  characters.forEach((character) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/character/${character.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  weapons.forEach((weapon) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/weapon/${weapon.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  tcg.forEach((card) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/tcg/card/${card.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  const posts = await getPosts("genshin");

  posts.data.forEach((post) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/genshin/blog/${post.slug}`,
        lastModified: `${post.updatedAt}`,
      });
    });
  });

  return routes;
}

async function getHSRSpecificRoutes() {
  const hsrData = new HSRData();
  const characters = await hsrData.characters();
  const items = await hsrData.items();
  const messages = await hsrData.messages();

  const routes: Route[] = [];

  [
    "",
    "/achievements",
    "/blog",
    "/blog/page/2",
    "/item",
    "/lightcones",
    "/message",
    "/relics",
    "/showcase",
    "/tierlist",
  ].forEach((route) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/hsr${route}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  characters.forEach((character) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/hsr/character/${character.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  items.forEach((item) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/hsr/item/${item.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  messages.forEach((message) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/hsr/message/${message.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  const posts = await getPosts("hsr");

  posts.data.forEach((post) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/hsr/blog/${post.slug}`,
        lastModified: `${post.updatedAt}`,
      });
    });
  });

  return routes;
}

async function getTOFSpecificRoutes() {
  const tofData = new TOFData();
  const characters = await tofData.characters();
  const matrices = await tofData.matrices();

  const routes: Route[] = [];

  ["", "/blog", "/blog/page/2", "/matrices"].forEach((route) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/tof${route}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  characters.forEach((character) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/tof/character/${character.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  matrices.forEach((matrix) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/tof/matrices/${matrix.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  const posts = await getPosts("tof");

  posts.data.forEach((post) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/tof/blog/${post.slug}`,
        lastModified: `${post.updatedAt}`,
      });
    });
  });

  return routes;
}

async function getZenlessSpecificRoutes() {
  const characters = await getRemoteData<any[]>("zenless", "characters");

  const routes: Route[] = [];

  ["", "/blog", "/blog/page/2", "/characters"].forEach((route) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/zenless${route}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  characters.forEach((character) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/zenless/characters/${character.id}`,
        lastModified: new Date().toISOString().split("T")[0],
      });
    });
  });

  const posts = await getPosts("zenless");

  posts.data.forEach((post) => {
    i18n.locales.forEach((locale) => {
      routes.push({
        url: `${baseDomain}/${locale}/zenless/blog/${post.slug}`,
        lastModified: `${post.updatedAt}`,
      });
    });
  });

  return routes;
}
