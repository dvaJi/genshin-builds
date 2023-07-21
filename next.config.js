const isDev = process.env.NODE_ENV === "development";

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
  i18n: {
    locales: [
      "en",
      "es",
      "ja",
      "cn",
      "zh-tw",
      "de",
      "fr",
      "id",
      "it",
      "ko",
      "pt",
      "ru",
      "th",
      "tr",
      "vi",
    ],
    defaultLocale: "en",
    localeDetection: !isDev,
  },
  images: {
    domains: [
      "gi-builds.sfo3.digitaloceanspaces.com",
      "i1.wp.com",
      "i2.wp.com",
      "i3.wp.com",
      "tof-builds.sfo3.digitaloceanspaces.com",
      "hsr-builds.sfo3.digitaloceanspaces.com",
      "img-cdn1.ravens-scans.com",
    ],
  },
  experimental: {
    legacyBrowsers: false,
  },
  rewrites: async () => [
    {
      source: "/ads.txt",
      destination: process.env.ADS_TXT_PUB || "/ads.txt",
    },
  ],
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
};

module.exports = withPWA(withBundleAnalyzer(nextConfig));
