export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");

    const { registerInitialCache } = await import(
      "@neshca/cache-handler/instrumentation"
    );
    const CacheHandler = (await import("./cache-handler.mjs")).default;
    await registerInitialCache(CacheHandler);
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
