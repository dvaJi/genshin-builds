import Metadata from "@components/Metadata";
import fs from "fs";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import Link from "next/link";
import remarkGfm from "remark-gfm";
const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type FMProps = {
  title: string;
  description: string;
  creationDatetime: string;
  modificationDatetime: string;
  author: string;
  tags: string[];
  version: number;
};

const CustomLink = (props: any) => {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const components = {
  a: CustomLink,
  Ads,
  FrstAds,
};

export default function PostPage({
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log(source);
  const fm = source.frontmatter;
  return (
    <div>
      <Metadata pageTitle={fm.title} pageDescription={fm.description} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">{fm.title}</h2>
      <p className="-mt-4">{fm.description}</p>
      <article className="prose prose-invert card max-w-none">
        <MDXRemote {...source} components={components} />
      </article>
    </div>
  );
}
export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps(
  ctx: GetStaticPropsContext<{
    slug: string;
  }>
) {
  const { slug } = ctx.params!;

  let postFile = null;

  try {
    postFile = fs.readFileSync(
      `_content/genshin/upcomingversion/${slug}-${ctx.locale}.mdx`
    );
  } catch (e: any) {
    console.log(e);
    return {
      redirect: {
        destination: `/en/genshin/upcoming-version/${slug}`,
        permanent: false,
      },
    };
  }

  const mdxSource = await serialize<Record<string, unknown>, FMProps>(
    postFile,
    {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    }
  );

  return {
    props: {
      source: mdxSource,
    },
    // enable ISR
    // revalidate: 60,
  };
}
