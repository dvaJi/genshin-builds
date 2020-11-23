import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const contentsDirectory = join(process.cwd(), "_content");

export function getContentSlugs() {
  return fs.readdirSync(contentsDirectory);
}

export function getContentBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(contentsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items: { [prop: string]: string } = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (data[field]) {
      items[field] = data[field];
    }
  });

  return items;
}
