import { getGenshinData as giData, getHSRData as hsrData } from "@lib/dataApi";
import { getRemoteData } from "@lib/localData";

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

  const zenlessRoutes = await getZenlessSpecificRoutes();
  routes.push(...zenlessRoutes);

  return routes;
}

async function getGenshinSpecificRoutes() {
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
    routes.push({
      url: `${baseDomain}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const characters = await getGenshinData("characters");

  characters.forEach((character: any) => {
    routes.push({
      url: `${baseDomain}/character/${character.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const weapons = await getGenshinData("weapons");
  weapons.forEach((weapon: any) => {
    routes.push({
      url: `${baseDomain}/weapon/${weapon.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const tcg = await getGenshinData("tcgCards");
  tcg.forEach((card: any) => {
    routes.push({
      url: `${baseDomain}/tcg/card/${card.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  return routes;
}

async function getGenshinData(resource: string) {
  return giData<any>({ resource, select: ["id"] });
}

async function getHSRSpecificRoutes() {
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
    routes.push({
      url: `${baseDomain}/hsr${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const characters = await getHSRData("characters");

  characters.forEach((character) => {
    routes.push({
      url: `${baseDomain}/hsr/character/${character.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const items = await getHSRData("items");

  items.forEach((item) => {
    routes.push({
      url: `${baseDomain}/hsr/item/${item.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  const messages = await getHSRData("messages");
  messages.forEach((message) => {
    routes.push({
      url: `${baseDomain}/hsr/message/${message.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  return routes;
}

async function getHSRData(resource: string) {
  return hsrData<any[]>({ resource, select: ["id"] });
}

async function getZenlessSpecificRoutes() {
  const characters = await getRemoteData<any[]>("zenless", "characters");

  const routes: Route[] = [];

  ["", "/blog", "/blog/page/2", "/characters"].forEach((route) => {
    routes.push({
      url: `${baseDomain}/zenless${route}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  characters.forEach((character) => {
    routes.push({
      url: `${baseDomain}/zenless/characters/${character.id}`,
      lastModified: new Date().toISOString().split("T")[0],
    });
  });

  return routes;
}
