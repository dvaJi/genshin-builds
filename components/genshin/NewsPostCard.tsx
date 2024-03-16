"use client";

import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import type { News } from "@lib/news";
import { getTimeAgo } from "@lib/timeago";

interface Props {
  post: News;
  type?: "simple" | "detailed";
}

const NewsPostCard = ({ post, type = "detailed" }: Props) => {
  const timeAgo = getTimeAgo(new Date(post.date).getTime(), 'en');
  return (
    <Link
      href={post.url}
      className="group mx-auto max-w-md overflow-hidden p-2"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded bg-vulcan-900 object-cover">
        <LazyLoadImage
          src={post.featuredImage.sourceUrl}
          placeholderSrc={post.featuredImage.sourceUrl}
          alt={post.title}
          className="aspect-video w-full rounded object-cover shadow-2xl transition-all group-hover:scale-105 group-hover:brightness-110"
        />
      </div>
      <div>
        <h3 className="my-1 text-lg text-slate-300 transition-all group-hover:text-slate-100">
          {post.title}
        </h3>
        {type === "detailed" ? (
          <p
            className="mb-1 text-sm text-slate-400"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        ) : null}
        {type === "detailed" ? (
          <div className="flex justify-between">
            <div>
              {/* <span className="mr-2 rounded bg-vulcan-600 p-1 px-1.5 text-xs">
              {guide.type}
            </span> */}
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="mr-2 rounded bg-vulcan-700 p-1 px-1.5 text-xs text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-baseline text-xs">{timeAgo}</div>
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default memo(NewsPostCard);
