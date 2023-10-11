import { BlogPost } from "@prisma/client";
import { useEffect, useState, type FormEvent } from "react";
import slugify from "slugify";

import Button from "@components/admin/Button";
import { languages } from "@utils/locale-to-lang";

type Props = {
  onSubmit: (event: any) => void;
  onContentChange: (content: string) => void;
  isLoading: boolean;
  initialData?: BlogPost;
};

function BlogPostForm({
  onSubmit,
  isLoading,
  onContentChange,
  initialData,
}: Props) {
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [slug, setSlug] = useState<string>(initialData?.slug || "");
  const [language, setLanguage] = useState<string>(
    initialData?.language || "en"
  );
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [image, setImage] = useState<string>(initialData?.image || "");
  // const [authorName, setAuthorName] = useState<string>(
  //   initialData?.authorName || "GenshinBuilds"
  // );
  // const [authorAvatar, setAuthorAvatar] = useState<string>(
  //   initialData?.authorAvatar || "gb.png"
  // );
  // const [authorLink, setAuthorLink] = useState<string>(
  //   initialData?.authorLink || "https://twitter.com/genshin_builds"
  // );
  const [tags, setTags] = useState<string>(initialData?.tags || "");
  const [isPublished, setIsPublished] = useState<boolean>(
    initialData?.published || false
  );
  const [content, setContent] = useState<string>(initialData?.content || "");

  useEffect(() => {
    setSlug(
      slugify(title, {
        locale: language,
        lower: true,
      })
    );
  }, [title, language]);

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(
      Object.assign(Object.fromEntries(formData), {
        published: isPublished,
      })
    );
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="grid grid-cols-1 gap-6 border-r border-zinc-800 bg-zinc-900 p-3"
    >
      <label className="block">
        <span className="text-zinc-400">Title</span>
        <input
          type="text"
          name="title"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          required
        />
      </label>
      <label className="block">
        <span className="text-zinc-400">Slug (url)</span>
        <button className="ml-2" onClick={() => setSlug(crypto.randomUUID())}>
          generate random
        </button>
        <input
          type="text"
          name="slug"
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          required
        />
      </label>
      <label className="block">
        <span className="text-zinc-400">Language</span>
        <select
          name="language"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setLanguage(e.target.value)}
          required
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-zinc-400">Description</span>
        <input
          type="text"
          name="description"
          placeholder="description"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          required
        />
      </label>
      <label className="block">
        <span className="text-zinc-400">image</span>
        <input
          type="text"
          name="image"
          placeholder="image"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setImage(e.target.value)}
          value={image}
          required
        />
      </label>
      {/* <label className="block">
        <span className="text-zinc-400">authorName</span>
        <input
          type="text"
          name="authorName"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setAuthorName(e.target.value)}
          value={authorName}
          required
        />
      </label>
      <label className="block">
        <span className="text-zinc-400">Author Avatar</span>
        <input
          type="text"
          name="authorAvatar"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setAuthorAvatar(e.target.value)}
          value={authorAvatar}
          required
        />
      </label>
      <label className="block">
        <span className="text-zinc-400">Author Link</span>
        <input
          type="text"
          name="authorLink"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setAuthorLink(e.target.value)}
          value={authorLink}
          required
        />
      </label> */}
      <label className="block">
        <span className="text-zinc-400">tags</span>
        <input
          type="text"
          name="tags"
          placeholder="tag1,tag2"
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-400 focus:ring-opacity-50"
          onChange={(e) => setTags(e.target.value)}
          value={tags}
          required
        />
      </label>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          name="published"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
          className="rounded border-zinc-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:ring-offset-0"
        />
        <span className="ml-2">Published</span>
      </label>
      <label className="block">
        <span className="text-zinc-400">Content</span>
        <textarea
          name="content"
          rows={30}
          className="mt-1 block w-full rounded-md border-zinc-900 bg-zinc-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          onChange={(e) => {
            setContent(e.target.value);
            onContentChange(e.target.value);
          }}
          value={content}
          required
        />
      </label>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}

export default BlogPostForm;
