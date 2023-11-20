"use client";

import { BlogPost } from "@prisma/client";
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
    <Link
      href={`/tof/blog/${post.slug}`}
      className="group mx-auto max-w-md overflow-hidden p-2"
    >
      <div className="relative aspect-video w-full overflow-hidden object-cover">
        <LazyLoadImage
          src={getImg("tof", `/blog/${post.image}`, {
            width: 450,
            height: 260,
          })}
          alt={post.title}
          className="aspect-video w-full rounded object-cover shadow-2xl transition-all group-hover:scale-105 group-hover:brightness-110"
        />
      </div>
      <div>
        <h3 className="my-1 text-lg text-slate-300 transition-all group-hover:text-slate-100">
          {post.title}
        </h3>
        <p className="mb-1 text-sm text-slate-400">{post.description}</p>
        <div className="flex justify-between">
          <div>
            {/* <span className="mr-2 rounded bg-vulcan-600 p-1 px-1.5 text-xs">
              {guide.type}
            </span> */}
            {post.tags.split(",").map((tag: string) => (
              <span
                key={tag}
                className="mr-2 rounded bg-vulcan-700 p-1 px-1.5 text-xs text-slate-500"
              >
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-baseline text-xs">{timeAgo}</div>
        </div>
      </div>
    </Link>
  );
};

export default memo(BlogPostCard);
