const isDev = process.env.IS_DEV_ENV === "true";

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
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  // i18n: {
  //   locales: [
  //     "en",
  //     "es",
  //     "ja",
  //     "cn",
  //     "zh-tw",
  //     "de",
  //     "fr",
  //     "id",
  //     "it",
  //     "ko",
  //     "pt",
  //     "ru",
  //     "th",
  //     "tr",
  //     "vi",
  //   ],
  //   defaultLocale: "en",
  //   localeDetection: !isDev,
  // },
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
        hostname: "tof-builds.sfo3.digitaloceanspaces.com",
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
  ],
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
  transpilePackages: ["react-md-editor"],
};

module.exports = withPWA(withBundleAnalyzer(nextConfig));
