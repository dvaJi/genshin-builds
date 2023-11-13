import type { BlogPost } from "@prisma/client";
import Link from "next/link";
import { memo } from "react";

// import useIntl from "@hooks/use-intl";
import { getImg } from "@lib/imgUrl";
// import { getTimeAgo } from "@lib/timeago";

interface Props {
  post: BlogPost;
}

const BlogPostCard = ({ post }: Props) => {
  // const { locale } = useIntl("blog");
  // const timeAgo = getTimeAgo(new Date(post.updatedAt).getTime(), locale);
  return (
    <Link
      href={`/zenless/blog/${post.slug}`}
      className="group mx-auto max-w-md overflow-hidden p-2"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-bl-[3.5rem] rounded-tr-[3.5rem] object-cover">
        <img
          src={getImg("zenless", `/blog/${post.image}`, {
            width: 450,
            height: 260,
          })}
          alt={post.title}
          className="aspect-video w-full rounded object-cover transition-transform duration-300 group-hover:rotate-1 group-hover:scale-110"
        />
      </div>
      <div className="mx-1">
        <div className="flex">
          <div className="mr-1 text-sm">2023/11/04</div>
          {/* <div className="">Events</div> */}
        </div>
        <h3 className="my-1 text-xl font-semibold text-zinc-950 transition-all group-hover:underline">
          {post.title}
        </h3>
        <p className="mb-1 text-sm text-zinc-400">{post.description}</p>
      </div>
    </Link>
  );
};

export default memo(BlogPostCard);
