import { getLocale } from "@lib/localData";
import { GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { MDContent } from "../interfaces/md-content";
import markdownToHtml from "../lib/markdownToHtml";
import { getContentBySlug } from "../lib/mdApi";

interface MdPage {
  data: MDContent;
}

const PrivacyPolicy = ({ data }: MdPage) => {
  const router = useRouter();
  return (
    <div>
      <Head>
        <title>{data.title} | GenshinBuilds</title>
        <meta property="og:image" content={data.ogImage?.url} />
      </Head>
      {router.isFallback ? (
        <div>Loading...</div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: data.content }}></div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);
  const post = getContentBySlug("privacy-policy", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      data: {
        ...post,
        content,
      },
      lngDict,
    },
  };
}

export default PrivacyPolicy;
