import remark from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdown: any): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
