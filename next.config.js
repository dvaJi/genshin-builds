module.exports = {
  i18n: {
    locales: ["en", "es", "jp"],
    defaultLocale: "en",
    localeDetection: false,
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
