// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9c7422fbfed53fb87f55bc455bb22a83@o95426.ingest.us.sentry.io/4507630267400192",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',

  beforeSend(event) {
    const hasAdsStackFrame = (frames: Sentry.StackFrame[]) => {
      // Sometimes the last frame is not the one we want, like: "\u003Canonymous\u003E"
      // So we need to find the last frame that is not from Sentry or pubfig.engine.js

      const adsFilenames =
        /.*(pubfig\.engine\.js|prebid-analytics\.js|app:\/\/\/ym\.[0-9]\.js|app:\/\/\/pageFold\/ftpagefold_v[0-9]+\.[0-9]+\.[0-9]+\.js).*/;

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
      const domainPattern = /.*([a-z]\.pub\.network|googleads.g.doubleclick).*/;

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
