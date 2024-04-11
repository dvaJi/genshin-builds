/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://genshin-builds.com/",
  generateRobotsTxt: true, // (optional)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          // Disallow query parameters in tcg/deck-builder?code=
          "*/tcg/deck-builder?code=*",
        ],
      },
    ],
  },
};
