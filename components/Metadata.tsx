import { memo } from "react";
import Head from "next/head";
import useIntl from "@hooks/use-intl";

interface MetadataProps {
  pageTitle?: string;
  pageDescription?: string;
  jsonLD?: string;
}

const Metadata = ({ pageTitle, pageDescription, jsonLD }: MetadataProps) => {
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
  const description = pageDescription ? pageDescription : defaultDescription;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={defaultTitle} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
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
