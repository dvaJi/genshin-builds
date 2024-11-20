import { Metadata } from "next";

import { i18n } from "../i18n-config";

interface PageSEOProps {
  title: string;
  path: string;
  locale?: string;
  description?: string;
  image?: string;
  noOpenGraph?: boolean;
  [key: string]: any;
}

const baseDomain = "https://genshin-builds.com";

export function genPageMetadata({
  title,
  description,
  path,
  image,
  locale,
  noOpenGraph,
  ...rest
}: PageSEOProps): Metadata {
  const siteMetadata = {
    title: "Genshin Impact Wiki Database",
    description:
      "Learn about every character in Genshin Impact including their skills, talents, builds, and tier list.",
    socialBanner: "https://genshin-builds.com/icons/meta-image.jpg",
  };
  const domain = `${baseDomain}${path}`;

  const redirectedPathName = (locale: string) => {
    return `${baseDomain}/${locale}${path}`;
  };

  const openGraph = noOpenGraph
    ? {}
    : {
        title: `${title} | ${siteMetadata.title}`,
        description: description || siteMetadata.description,
        url: redirectedPathName(locale ?? "en"),
        siteName: siteMetadata.title,
        images: image ? [image] : [siteMetadata.socialBanner],
        locale: locale || "en_US",
        type: "website",
      };

  return {
    metadataBase: new URL(domain),
    title,
    description,
    openGraph,
    twitter: {
      site: "@earlyggcom",
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      card: "summary_large_image",
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    alternates: {
      canonical: redirectedPathName(locale ?? "en"),
      languages: {
        ...i18n.locales.reduce(
          (acc, locale) => {
            let hreflang: string = locale;

            if (locale === "cn") {
              hreflang = "zh-CN";
            }

            acc[hreflang] = redirectedPathName(locale);
            return acc;
          },
          {} as Record<string, string>
        ),
        "x-default": redirectedPathName("en"),
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    manifest: `${baseDomain}/manifest.json`,
    icons: [
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-57x57.png`,
        sizes: "57x57",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-60x60.png`,
        sizes: "60x60",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-72x72.png`,
        sizes: "72x72",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-76x76.png`,
        sizes: "76x76",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-114x114.png`,
        sizes: "114x114",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-120x120.png`,
        sizes: "120x120",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-144x144.png`,
        sizes: "144x144",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-152x152.png`,
        sizes: "152x152",
        type: "image/png",
      },
      {
        rel: "apple-touch-icon",
        url: `${baseDomain}/icons/apple-icon-180x180.png`,
        sizes: "180x180",
        type: "image/png",
      },
      {
        url: `${baseDomain}/icons/android-icon-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: `${baseDomain}/icons/favicon-32x32.png`,
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: `${baseDomain}/icons/favicon-96x96.png`,
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: `${baseDomain}/icons/favicon-16x16.png`,
        sizes: "16x16",
        type: "image/png",
      },
    ],
    ...rest,
  };
}
