import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { BlogPosting, WithContext } from "schema-dts";

import { genPageMetadata } from "@app/seo";
import PostRender from "@components/tof/PostRender";
import { getPostBySlug } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getImg } from "@lib/imgUrl";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: {
    slug: string;
    lang: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return;
  }

  const { title, description, image } = post;
  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return genPageMetadata({
    title,
    description,
    path: `/tof/blog/${params.slug}`,
    image: ogImage,
    locale: post.language,
  });
}

export default async function Page({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: `${post.createdAt}`,
    dateModified: `${post.updatedAt}`,
    url: `https://genshin-builds.com/tof/blog/${params.slug}`,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    image: getImg("tof", `/blog/${post.image}`),
    publisher: {
      "@type": "Organization",
      name: "tofBuilds",
      logo: {
        "@type": "ImageObject",
        url: "https://genshin-builds.com/icons/android-icon-72x72.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      ></script>
      <article className="relative mx-auto max-w-screen-md">
        <div>
          <Link
            href={`/${params.lang}/tof/blog`}
            className="rounded-3xl border-2 border-transparent px-3 py-1 text-sm font-semibold transition-colors hover:border-zinc-950"
          >
            {/* {t({ id: "back", defaultMessage: "Back to Blog" })} */}
            Back
          </Link>
        </div>
        <header className="mx-2 lg:mx-0">
          <h1 className="my-6 text-6xl font-bold text-zinc-950">
            <Balancer>{post.title}</Balancer>
          </h1>
          <p className="text-lg text-zinc-800">{post.description}</p>
          <FrstAds
            placementName="genshinbuilds_billboard_atf"
            classList={["flex", "justify-center"]}
          />
          <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
          <div className="flex items-center justify-between">
            <a
              href={post.authorLink}
              title={post.authorName}
              className="px-sm-0 my-1 flex flex-wrap items-center gap-2 px-2"
            >
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="rounded-full border-2 border-vulcan-900/80 p-px"
                width="40"
                height="40"
              />

              <span className="font-semibold text-zinc-800">
                {post.authorName}
              </span>
            </a>
            <div className="mt-1 pr-2 text-sm italic">
              <span data-time={post.updatedAt}>{`${post.updatedAt}`}</span>
            </div>
          </div>
        </header>

        <section className="prose mt-0 max-w-none">
          <img
            alt={post.title}
            src={getImg("tof", `/blog/${post.image}`)}
            className="mx-auto rounded-lg text-center"
          />
          <PostRender compiledSource={post.content} />
        </section>
      </article>
    </>
  );
}
