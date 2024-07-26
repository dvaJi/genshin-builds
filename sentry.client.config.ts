// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9c7422fbfed53fb87f55bc455bb22a83@o95426.ingest.us.sentry.io/4507630267400192",

  enabled: process.env.IS_DEV_ENV !== "true",

  tracePropagationTargets: ["localhost", /^https:\/\/genshin-builds\.com\/api/],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  sampleRate: 0.25,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event) {
    const hasAdsStackFrame = (frames: Sentry.StackFrame[]) => {
      // Sometimes the last frame is not the one we want, like: "\u003Canonymous\u003E"
      // So we need to find the last frame that is not from Sentry or pubfig.engine.js

      const adsFilenames =
        /.*(bao-csm|tag\/js\/gpt\.js|hadron\.js|inpage\.js|pubfig\.engine|prebid-analytics|app:\/\/\/ym\.[0-9]\.js|app:\/\/\/pageFold\/ftpagefold_v).*/;

      for (let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        if (adsFilenames.test(frame.filename ?? "")) {
          return true;
        }
      }

      return false;
    };

    if (
      hasAdsStackFrame(event.exception?.values?.[0]?.stacktrace?.frames ?? [])
    ) {
      return null;
    }

    const hasAdsBreadcrumb = (
      breadcrumbs: IterableIterator<Sentry.Breadcrumb>
    ) => {
      // Define a regex pattern to match the desired domains
      const domainPattern =
        /.*([a-z]\.pub\.network|googleads\.g\.doubleclick|ib\.adnxs.com|hadron\.ad).*/;

      for (const breadcrumb of breadcrumbs) {
        if (domainPattern.test(breadcrumb.data?.url)) {
          return true;
        }
      }

      return false;
    };

    if (hasAdsBreadcrumb(event.breadcrumbs?.values() ?? ([] as any))) {
      return null;
    }

    return event;
  },
});
