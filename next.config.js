const isDev = process.env.NODE_ENV === "development";

module.exports = {
  i18n: {
    locales: ["en", "es", "ja"],
    defaultLocale: "en",
    localeDetection: !isDev,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/characters",
        permanent: true,
      },
    ];
  },
};
