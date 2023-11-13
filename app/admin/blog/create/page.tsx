"use client";

import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { Fragment } from "react";

import { Session } from "@lib/session";
import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("../blog-editor"), { ssr: false });

function CreatePost() {
  const { status, data: session } = useSession();
  const params = useSearchParams();
  const game = params?.get("game") || "genshin";

  if (status === "unauthenticated") {
    return redirect("/admin");
  }

  return (
    <BlogEditor
      post={{ game } as any}
      session={session as Session}
      content={<Fragment />}
    />
  );
}

export default CreatePost;
