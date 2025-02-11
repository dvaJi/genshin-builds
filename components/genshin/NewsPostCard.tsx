"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import type { News } from "@lib/news";

interface Props {
  post: News;
  type?: "simple" | "detailed";
}

export const NewsPostCard = ({ post, type = "simple" }: Props) => {
  const timeAgo = formatDistanceToNow(new Date(post.date), { addSuffix: true });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={`/genshin/news/${post.slug}`}
        className="bg-card hover:shadow-primary/10 group block h-full overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
        prefetch={false}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          {/* Image gradient overlay */}
          <div className="from-background via-background/20 absolute inset-0 z-10 bg-gradient-to-t to-transparent opacity-60" />

          {/* Post image */}
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.title}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Post date */}
          <div className="absolute bottom-3 right-3 z-20">
            <span className="bg-card/90 text-muted-foreground rounded-full px-3 py-1 text-xs backdrop-blur-sm">
              {timeAgo}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-card-foreground group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors">
            {post.title}
          </h3>

          {type === "detailed" && (
            <>
              <p
                className="text-muted-foreground mt-2 line-clamp-2 text-sm"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-secondary/50 text-muted-foreground group-hover:bg-secondary/80 group-hover:text-secondary-foreground inline-flex rounded-full px-3 py-1 text-xs backdrop-blur-sm transition-colors duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
