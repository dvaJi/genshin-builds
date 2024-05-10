import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import type { News } from "@lib/news";

interface Props {
  post: News;
}

const NewsPostCard = ({ post }: Props) => {
  const formattedDate = dayjs(post.date).format("YYYY/MM/DD");
  return (
    <Link
      href={post.url}
      className="group mx-auto max-w-md overflow-hidden p-2"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-bl-[3.5rem] rounded-tr-[3.5rem] object-cover">
        <Image
          src={post.featuredImage.sourceUrl}
          width={450}
          height={260}
          alt={post.title}
          className="aspect-video w-full rounded object-cover transition-transform duration-300 group-hover:rotate-1 group-hover:scale-110"
        />
      </div>
      <div className="mx-1">
        <div className="flex">
          <div className="mr-1 text-sm">{formattedDate}</div>
          {/* <div className="">Events</div> */}
        </div>
        <h3 className="my-1 text-xl font-semibold text-zinc-950 transition-all group-hover:underline">
          {post.title}
        </h3>
        <p
          className="mb-1 text-sm text-zinc-400"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
      </div>
    </Link>
  );
};

export default memo(NewsPostCard);
