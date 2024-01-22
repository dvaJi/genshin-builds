import { redirect } from "next/navigation";
import { Fragment } from "react";

import { Session } from "@lib/session";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import { getPostById } from "@lib/blog";

const BlogEditor = dynamic(() => import("../blog-editor"), { ssr: false });

type Props = {
  searchParams: Record<string, string>;
};

export default async function CreatePost({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  const game = searchParams.game || "genshin";
  const language = searchParams.lang || "en";
  const postId = searchParams.postid || "";

  if (!session) {
    return redirect("/admin");
  }

  let post: any = {
    game
  };

  if (postId) {
    post = await getPostById(postId);
  }

  return (
    <BlogEditor
      post={post}
      postContent={{language} as any}
      session={session as Session}
      content={<Fragment />}
    />
  );
}
