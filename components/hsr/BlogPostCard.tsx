"use client";

import type { BlogPost } from "@prisma/client";
import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useIntl from "@hooks/use-intl";
import { getImg } from "@lib/imgUrl";
import { getTimeAgo } from "@lib/timeago";

interface Props {
  post: BlogPost;
}

const BlogPostCard = ({ post }: Props) => {
  const { locale } = useIntl("blog");
  const timeAgo = getTimeAgo(new Date(post.updatedAt).getTime(), locale);

  return (
    <Link href={`/${locale}/hsr/blog/${post.slug}`} className="group p-2">
      <div className="mx-auto max-w-md overflow-hidden rounded-sm bg-hsr-surface2 shadow ring-hsr-accent/70 group-hover:ring-1">
        <LazyLoadImage
          src={getImg("hsr", `/blog/${post.image}`, {
            width: 450,
            height: 260,
            crop: true,
          })}
          className="aspect-video w-full object-cover"
          alt={post.title}
        />
        <div className="p-4">
          <p className="text-primary-500 mb-1 text-xs">
            <time>{timeAgo}</time>
          </p>
          <h3 className="text-xl font-medium text-zinc-200">{post.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{post.description}</p>
          <div className="mt-4 flex gap-2">
            {post.tags.split(",").map((tag: string) => (
              <span
                key={tag}
                className="mr-2 rounded bg-hsr-surface3 p-1 px-1.5 text-xs text-zinc-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(BlogPostCard);
