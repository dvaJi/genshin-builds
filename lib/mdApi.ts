import fs from "fs";
import { join } from "path";

const contentsDirectory = join(process.cwd(), "_content");

export function getContentSlugs() {
  return fs.readdirSync(contentsDirectory);
}

export function getContentBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(contentsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return fileContents;
}
