import { getContentBySlug } from "@lib/mdApi";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function PrivacyPolicy() {
  const post = getContentBySlug("privacy-policy");
  return (
    <div className="card">
      <article className="prose prose-invert max-w-none">
        <MDXRemote source={post} />
      </article>
    </div>
  );
}
