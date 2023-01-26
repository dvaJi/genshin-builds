const isDev = process.env.NODE_ENV === "development";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withPWA = require("next-pwa")({
  dynamicStartUrl: false,
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
  experimental: {
    legacyBrowsers: false,
  },
};

module.exports = withPWA(withBundleAnalyzer(nextConfig));
