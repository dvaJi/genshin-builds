import { Metadata } from "next";
import { i18n } from "../i18n-config";

interface PageSEOProps {
  title: string;
  path: string;
  locale?: string;
  description?: string;
  image?: string;
  [key: string]: any;
}

const baseDomain = "https://genshin-builds.com";

export function genPageMetadata({
  title,
  description,
  path,
  image,
  locale,
  ...rest
}: PageSEOProps): Metadata {
  const siteMetadata = {
    title: "Genshin-Builds.com Wiki Database",
    description:
      "Learn about every character in Genshin Impact including their skills, talents, builds, and tier list.",
    socialBanner: "https://genshin-builds.com/icons/meta-image.jpg",
  };
  const domain = `${baseDomain}${path}`;

  const redirectedPathName = (locale: string) => {
    return `${baseDomain}/${locale}${path}`;
  };

  return {
    metadataBase: new URL(domain),
    title,
    description,
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: "./",
      siteName: siteMetadata.title,
      images: image ? [image] : [siteMetadata.socialBanner],
      locale: locale || "en_US",
      type: "website",
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      card: "summary_large_image",
      images: image ? [image] : [siteMetadata.socialBanner],
    },
    alternates: {
      canonical: redirectedPathName("en"),
      languages: {
        ...i18n.locales.reduce(
          (acc, locale) => {
            acc[locale] = redirectedPathName(locale);
            return acc;
          },
          {} as Record<string, string>
        ),
        "x-default": redirectedPathName("en"),
      },
    },
    ...rest,
  };
}
