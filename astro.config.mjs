import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/static";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import { i18n, defaultLocaleSitemapFilter } from "astro-i18n-aut";
import sitemap from "@astrojs/sitemap";

const defaultLocale = "en";
const locales = {
  en: "en-US", // the `defaultLocale` value must present in `locales` keys
  es: "es-ES",
  fr: "fr-CA",
};

// https://astro.build/config
export default defineConfig({
  experimental: {
    redirects: true,
  },
  site: "https://genshin-builds.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    react(),
    tailwind(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    i18n({
      locales,
      defaultLocale,
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: defaultLocaleSitemapFilter({ defaultLocale }),
    }),
  ],
  output: "static",
  adapter: vercel(),
});
