export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerInitialCache } = await import(
      "@neshca/cache-handler/instrumentation"
    );
    // Assuming that your CacheHandler configuration is in the root of the project and the instrumentation is in the src directory.
    // Please adjust the path accordingly.
    // CommonJS CacheHandler configuration is also supported.
    const CacheHandler = (await import("./cache-handler.mjs")).default;
    await registerInitialCache(CacheHandler);
  }
}
