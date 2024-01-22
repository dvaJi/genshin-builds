import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { BlogPosting, WithContext } from "schema-dts";

import PostRender from "@components/zenless/PostRender";
import { getPostContentBySlug } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getImg } from "@lib/imgUrl";
import Image from "next/image";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: {
    lang: string;
    slug: string[];
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join("/"));
  const post = await getPostContentBySlug(slug, params.lang);
  if (!post) {
    return;
  }

  const { title, createdAt: publishedTime, description, image } = post;
  const ogImage = `https://genshin-builds.com/api/og?image=/zenless/blog/${image ?? post.post.image}&title=${title}&description=${description}`;

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

export default async function Page({ params }: Props) {
  const slug = decodeURI(params.slug.join("/"));

  // Filter out drafts in production
  const post = await getPostContentBySlug(slug, params.lang);

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
      name: post.post.authorName,
    },
    image: getImg("zenless", `/blog/${post.image ?? post.post.image}`),
    publisher: {
      "@type": "Organization",
      name: "ZenlessBuilds",
      logo: {
        "@type": "ImageObject",
        url: "https://genshin-builds.com/icons/android-icon-72x72.png",
      },
    },
  };

  const bgImage = getImg("zenless", `/blog/${post.image ?? post.post.image}`, {
    quality: 50,
  });

  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-0 flex items-start justify-center overflow-hidden">
        <Image
          className="h-full w-full select-none object-cover"
          alt="Background image"
          src={bgImage}
          fill={true}
        />
      </div>
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{
          background:
            "linear-gradient(rgb(244,244,245,.8),rgb(244,244,245,var(--tw-bg-opacity)) 900px)",
        }}
      />

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
            href={`/${params.lang}/zenless/blog`}
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
              href={post.post.authorLink}
              title={post.post.authorName}
              target="_blank"
              rel="noopener noreferrer"
              className="px-sm-0 my-1 flex flex-wrap items-center gap-2 px-2"
            >
              <Image
                src={post.post.authorAvatar}
                alt={post.post.authorName}
                className="rounded-full border-2 border-vulcan-900/80 p-px"
                width={40}
                height={40}
              />

              <span className="font-semibold text-zinc-800">
                {post.post.authorName}
              </span>
            </a>
            <div className="mt-1 pr-2 text-sm italic">
              <span data-time={post.updatedAt}>{`${post.updatedAt}`}</span>
            </div>
          </div>
        </header>

        <section className="prose mt-0 max-w-none bg-white p-4 rounded-xl shadow-xl">
          <Image
            alt={post.title}
            src={getImg("zenless", `/blog/${post.image ?? post.post.image}`)}
            className="mx-auto rounded-lg text-center"
            width={640}
            height={360}
          />
          <PostRender compiledSource={post.content} />
        </section>
      </article>
    </>
  );
}
