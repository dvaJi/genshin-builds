import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

export default async function markdownToHtml<T>(markdown: any) {
  const mdxSource = await serialize<Record<string, unknown>, T>(markdown, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return mdxSource;
}
