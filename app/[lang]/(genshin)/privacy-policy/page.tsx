import { compileMDX } from "next-mdx-remote/rsc";

import { routing } from "@i18n/routing";
import { getContentBySlug } from "@lib/mdApi";

export const dynamic = "force-static";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export default async function PrivacyPolicy() {
  const post = await compileMDX({ source: getContentBySlug("privacy-policy") });
  return (
    <div className="card">
      <article className="prose prose-invert max-w-none">
        {post.content}
      </article>
    </div>
  );
}
