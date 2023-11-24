import Card from "@components/ui/Card";

import { getContentBySlug } from "@lib/mdApi";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function PrivacyPolicy() {
  const post = getContentBySlug("privacy-policy", [
    "title",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
  ]);
  return (
    <Card>
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={post.content} />
      </article>
    </Card>
  );
}
