const isDev = process.env.IS_DEV_ENV === "true";

const { withAxiom } = require("next-axiom");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
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
    {
      source: "/:lang/tof/blog",
      destination: "https://earlygg.com/guides/tower-of-fantasy",
      permanent: true,
    },
  ],
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
  cacheHandler: !isDev && process.env.REDIS_URL ? require.resolve("./cache-handler.mjs") : undefined,
  experimental: {
    instrumentationHook: true,
  }
};

module.exports = withAxiom(withBundleAnalyzer(nextConfig));

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "francisco-vz",
  project: "genshinbuilds",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
