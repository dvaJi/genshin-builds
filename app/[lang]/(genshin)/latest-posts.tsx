import Image from "next/image";
import Link from "next/link";

import { getNews } from "@lib/news";

export async function LatestPosts() {
  const data = await getNews("genshin-impact");

  if (!data || !Array.isArray(data)) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <div
          key={post.slug}
          className="group transform transition-all duration-300 hover:-translate-y-1"
        >
          <Link
            href={`/genshin/news/${post.slug}`}
            className="block h-full overflow-hidden rounded-xl bg-gradient-to-br from-vulcan-800/90 to-vulcan-900/90 shadow-lg transition-all duration-300 hover:shadow-vulcan-500/10"
            prefetch={false}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {/* Image gradient overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-vulcan-900 via-vulcan-900/20 to-transparent opacity-60" />

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
                <span className="rounded-full bg-vulcan-800/90 px-3 py-1 text-xs text-slate-300 backdrop-blur-sm">
                  {new Date(post.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 text-lg font-medium text-slate-200 transition-colors group-hover:text-white">
                {post.title}
              </h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
