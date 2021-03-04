const fs = require("fs");
const globby = require("globby");

const WEBSITE_URL = "https://genshin-builds.com";

function addPage(page) {
  console.log(page);
  const path = page
    .replace("pages", "")
    .replace(".next/server/", "")
    .replace(".js", "")
    .replace(".tsx", "")
    .replace(".html", "")
    .replace(".mdx", "");
  const route = path === "/index" ? "" : path;

  return `  <url>
    <loc>${`${WEBSITE_URL}${route}`}</loc>
    <changefreq>hourly</changefreq>
  </url>`;
}

async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    ".next/server/pages/**/*{.js,.html}",
    "!.next/server/pages/**/[name].js",
    "!.next/server/pages/next/**/*{.js,.tsx,.html}",
    "!.next/server/pages/_*{.js,.tsx,.html}",
    "!.next/server/pages/api",
  ]);
  const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .sort((a, b) => a.localeCompare(b))
  .map(addPage)
  .join("\n")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap);
}

generateSitemap();
