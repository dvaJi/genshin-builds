import { GetStaticProps, InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";

import Card from "@components/ui/Card";
import { getLocale } from "@lib/localData";
import markdownToHtml from "@lib/markdownToHtml";
import { getContentBySlug } from "@lib/mdApi";

const PrivacyPolicy = ({
  data,
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Card>
      <Head>
        <title>{data.title} | GenshinBuilds</title>
        <meta property="og:image" content={data.ogImage?.url} />
      </Head>
      <article className="prose prose-invert max-w-none">
        <MDXRemote {...source} />
      </article>
    </Card>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const post = getContentBySlug("privacy-policy", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  const source = await markdownToHtml<any>(post.content || "");

  return {
    props: {
      data: {
        ...post,
      },
      source,
      lngDict,
    },
  };
};

export default PrivacyPolicy;
