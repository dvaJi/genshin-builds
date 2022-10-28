const isDev = process.env.NODE_ENV === "development";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
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
      "ko",
      "pt",
      "ru",
      "th",
      "vi",
    ],
    defaultLocale: "en",
    localeDetection: !isDev,
  },
  experimental: {
    legacyBrowsers: false,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
