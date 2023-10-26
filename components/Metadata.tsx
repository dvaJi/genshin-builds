import Head from "next/head";
import { memo } from "react";

import useIntl from "@hooks/use-intl";
import { useRouter } from "next/router";

interface MetadataProps {
  pageTitle?: string;
  pageDescription?: string;
  jsonLD?: string;
  customOg?: {
    title: string;
    description: string;
    image: string;
  };
}

const DOMAIN = process.env.NEXT_PUBLIC_GA_ID
  ? `https://genshin-builds.com`
  : "http://localhost:3000";

const Metadata = ({
  pageTitle,
  pageDescription,
  jsonLD,
  customOg,
}: MetadataProps) => {
  const router = useRouter();
  const { t } = useIntl("layout");
  const defaultTitle = t({
    id: "title",
    defaultMessage: "Genshin-Builds.com Wiki Database",
  });
  const title = pageTitle ? `${pageTitle} - ${defaultTitle}` : defaultTitle;

  const defaultDescription = t({
    id: "description",
    defaultMessage:
      "Learn about every character in Genshin Impact including their skills, talents, builds, and tier list.",
  });

  const isBlog = router.pathname.includes("/blog/");

  let image = `${DOMAIN}/icons/meta-image.jpg`;

  if (customOg) {
    image = `${DOMAIN}/api/og?image=${customOg.image}&title=${customOg.title}&description=${customOg.description}`;
  }

  const description = pageDescription ? pageDescription : defaultDescription;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={defaultTitle} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:image:alt" content={title} />
      {!isBlog &&
        router.locales?.map((locale) => (
          <link
            key={locale}
            rel="alternate"
            hrefLang={locale}
            href={`${DOMAIN}/${locale}${router.asPath}`}
          />
        ))}
      {jsonLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLD,
          }}
        />
      )}
    </Head>
  );
};

export default memo(Metadata);
