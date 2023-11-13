import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { BlogPosting, WithContext } from "schema-dts";

import { getPostBySlug } from "@lib/blog";
import PostRender from "@components/zenless/PostRender";
import { getImg } from "@lib/imgUrl";

const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join("/"));
  const post = await getPostBySlug(slug);
  if (!post) {
    return;
  }

  const { title, createdAt: publishedTime, description, image } = post;
  const ogImage = `https://genshin-builds.com/api/og?image=${image}&title=${title}&description=${description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: `${publishedTime}`,
      url: `https://genshin-builds.com/zenless/blog/${slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join("/"));

  // Filter out drafts in production
  const post = await getPostBySlug(slug);

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
    url: `https://genshin-builds.com/zenless/blog/${slug}`,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    image: getImg("zenless", `/blog/${post.image}`),
    publisher: {
      "@type": "Organization",
      name: "ZenlessBuilds",
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
            href="/zenless/blog"
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
            src={getImg("zenless", `/blog/${post.image}`)}
            className="mx-auto rounded-lg text-center"
          />
          <PostRender compiledSource={post.content} />
        </section>
      </article>
    </>
  );
}
