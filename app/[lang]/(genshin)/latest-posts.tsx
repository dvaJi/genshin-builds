import BlogPostCard from "@components/genshin/BlogPostCard";
import { getPostContents } from "@lib/blog";

type Props = {
  lang: string;
};

export async function LatestPosts({ lang }: Props) {
  const { data } = await getPostContents("genshin", lang, {
    limit: 3,
    page: 1,
  });

  return (
    <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-4">
      {data.map((post) => (
        <BlogPostCard key={post.title} post={post} type="simple" />
      ))}
    </div>
  );
}
