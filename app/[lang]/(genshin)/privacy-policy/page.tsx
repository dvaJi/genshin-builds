import { getContentBySlug } from "@lib/mdApi";
import { i18n } from "i18n-config";
import { compileMDX } from "next-mdx-remote/rsc";

export const dynamic = "force-static";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy",
};

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
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
