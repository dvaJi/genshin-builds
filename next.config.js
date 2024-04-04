const isDev = process.env.IS_DEV_ENV === "true";

const { withAxiom } = require("next-axiom");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dynamicStartUrl: false,
  disable: isDev,
});

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "i1.wp.com",
      },
      {
        hostname: "i2.wp.com",
      },
      {
        hostname: "i3.wp.com",
      },
      {
        hostname: "gi-builds.sfo3.digitaloceanspaces.com",
      },
      {
        hostname: "hsr-builds.sfo3.digitaloceanspaces.com",
      },
      {
        hostname: "img-cdn1.ravens-scans.com",
      },
      {
        hostname: "genshinbuilds.aipurrjects.com",
      },
      {
        hostname: "cdn.discordapp.com",
      },
    ],
  },
  rewrites: async () => [
    {
      source: "/ads.txt",
      destination: process.env.ADS_TXT_PUB || "/ads.txt",
    },
  ],
  redirects: async () => [
    {
      source: "/weapon/splendor_of_still_waters",
      destination: "/weapon/splendor_of_tranquil_waters",
      permanent: true,
    },
    {
      source: "/ru/weapons",
      destination: "/dmca",
      permanent: false,
    },
    {
      source: "/en/weapons",
      destination: "/dmca",
      permanent: false,
    },
    {
      source: "/:lang/genshin/blog",
      destination: "https://earlygg.com/guides/genshin-impact",
      permanent: true,
    },
    {
      source: "/:lang/genshin/blog/page/:page",
      destination: "https://earlygg.com/guides/genshin-impact",
      permanent: true,
    },
    {
      source: "/:lang/genshin/blog/:slug",
      destination: "https://earlygg.com/guides/genshin-impact",
      permanent: true,
    },
    {
      source: "/:lang/hsr/blog",
      destination: "https://earlygg.com/guides/star-rail",
      permanent: true,
    },
    {
      source: "/:lang/hsr/blog/page/:page",
      destination: "https://earlygg.com/guides/star-rail",
      permanent: true,
    },
    {
      source: "/:lang/hsr/blog/:slug",
      destination: "https://earlygg.com/guides/star-rail",
      permanent: true,
    },
    {
      source: "/:lang/zenless/blog",
      destination: "https://earlygg.com/guides/zenless",
      permanent: true,
    },
    {
      source: "/:lang/zenless/blog/page/:page",
      destination: "https://earlygg.com/guides/zenless",
      permanent: true,
    },
    {
      source: "/:lang/zenless/blog/:slug",
      destination: "https://earlygg.com/guides/zenless",
      permanent: true,
    },
  ],
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
};

module.exports = withAxiom(withPWA(withBundleAnalyzer(nextConfig)));
