// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: process.env.IS_DEV_ENV !== "true",

  tracePropagationTargets: ["localhost", /^https:\/\/genshin-builds\.com\/api/],

  // Adjust this value in production, or use tracesSampler for greater control
  sampleRate: 1,
  tracesSampleRate: 0.01,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  ignoreErrors: [
    "Script error.",
    "ResizeObserver loop limit exceeded",
    "Uncaught Error: unreachable: e.data !== MessagePort",
    "Object captured as promise rejection with keys: [object has no keys]",
    "HierarchyRequestError: The operation would yield an incorrect node tree.",
  ],

  denyUrls: [
    /pagead\/managed\/js\/gpt\//i,
    /googlesyndication\.com/i,
    /googletagservices\.com/i,
    /pubads\.g\.doubleclick\.net/i,
    /securepubads\.g\.doubleclick\.net/i,
    /adservice\.google\.com/i,
  ],

  beforeSend(event) {
    const hasAdsStackFrame = (frames: Sentry.StackFrame[]) => {
      // Sometimes the last frame is not the one we want, like: "\u003Canonymous\u003E"
      // So we need to find the last frame that is not from Sentry or pubfig.engine.js

      const adsFilenames =
        /.*(bao-csm|tag\/js\/gpt\.js|hadron\.js|inpage\.js|pubfig\.engine|prebid-analytics|app:\/\/\/ym\.[0-9]\.js|app:\/\/\/pageFold\/ftpagefold_v|uv\.handler\.js|pubads_impl\.js|pubfig\.min\.js).*/;

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
      breadcrumbs: IterableIterator<Sentry.Breadcrumb>,
    ) => {
      // Define a regex pattern to match the desired domains
      const domainPattern =
        /.*([a-z]\.pub\.network|googleads\.g\.doubleclick|ib\.adnxs.com|hadron\.ad|ups\.analytics\.yahoo\.com).*/;

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

    if (typeof window !== "undefined") {
      const router = window.__NEXT_DATA__?.props?.pageProps?.__N_SSP
        ? null
        : (window as any).next?.router;

      if (router) {
        event.extra = {
          ...event.extra,
          nextjs_route: router.route,
          query_params: router.query,
          asPath: router.asPath,
          pathname: router.pathname,
        };
      }
    }

    return event;
  },
});
