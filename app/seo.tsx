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
  const domain = `https://genshin-builds.com${path}`;

  return {
    metadataBase: new URL(domain),
    title,
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
      canonical: domain,
      languages: i18n.locales.reduce(
        (acc, locale) => {
          acc[locale] = `?lang=${locale}`;
          return acc;
        },
        {} as Record<string, string>
      ),
    },
    ...rest,
  };
}
