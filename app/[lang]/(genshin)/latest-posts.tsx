import NewsPostCard from "@components/genshin/NewsPostCard";
import { getNews } from "@lib/news";

export async function LatestPosts() {
  const data = await getNews("genshin-impact");

  return (
    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-4">
      {data.map((post) => (
        <NewsPostCard key={post.slug} post={post} type="simple" />
      ))}
    </div>
  );
}
