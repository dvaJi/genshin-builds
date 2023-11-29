import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { BlogPosting, WithContext } from "schema-dts";

import { genPageMetadata } from "@app/seo";
import PostRender from "@components/genshin/PostRender";
import useTranslations from "@hooks/use-translations";
import { getPostBySlug } from "@lib/blog";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getImg } from "@lib/imgUrl";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-dynamic";

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
    path: `/genshin/blog/${params.slug}`,
    image: ogImage,
    locale: post.language,
  });
}

export default async function GenshinPost({ params }: Props) {
  const { t } = await useTranslations(params.lang, "genshin", "blog");
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
    url: `https://genshin-builds.com/genshin/blog/${params.slug}`,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    image: getImg("genshin", `/blog/${post.image}`),
    publisher: {
      "@type": "Organization",
      name: "genshinBuilds",
      logo: {
        "@type": "ImageObject",
        url: "https://genshin-builds.com/icons/android-icon-72x72.png",
      },
    },
  };

  const bgImage = getImg("genshin", `/blog/${post.image}`, {
    quality: 50,
  });

  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-0 flex items-start justify-center overflow-hidden">
        <img
          className="h-full w-full select-none object-cover"
          alt="Background image"
          src={bgImage}
        />
      </div>
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-full"
        style={{
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
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
          <Link href={`/${params.lang}/genshin/blog`} className="text-sm hover:text-white">
            {t({ id: "back", defaultMessage: "Back to Blog" })}
          </Link>
        </div>
        <header className="mx-2 lg:mx-0">
          <h1 className="my-6 text-4xl font-semibold text-gray-100">
            <Balancer>{post.title}</Balancer>
          </h1>
          <p className="text-lg text-slate-200">{post.description}</p>
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

              <span className="font-semibold text-slate-300">
                {post.authorName}
              </span>
            </a>
            <div className="mt-1 pr-2 text-sm italic">
              <span data-time={post.updatedAt}>{`${post.updatedAt}`}</span>
            </div>
          </div>
        </header>

        <section className="prose prose-invert card mt-0 max-w-none">
          <img
            alt={post.title}
            src={getImg("genshin", `/blog/${post.image}`)}
            className="mx-auto rounded-lg text-center"
          />
          <PostRender compiledSource={post.content} />
        </section>
      </article>
    </>
  );
}
