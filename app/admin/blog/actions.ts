"use server";

import prisma from "@db/index";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const postUpdateSchema = z.object({
  id: z.string(),
  slug: z.string(),
  game: z.string(),
});

export async function updatePost(formData: FormData) {
  console.log("updatePost", { formData });

  const parse = postUpdateSchema.safeParse({
    id: formData.get("id"),
    slug: formData.get("slug"),
    game: formData.get("game"),
  });

  if (!parse.success) {
    return { message: parse.error };
  }

  const { id, slug, game } = parse.data;

  await prisma.blogPost.update({
    where: {
      id,
    },
    data: {
      slug,
      game,
    },
  });

  revalidatePath(`/admin/blog`);

  return { message: "success" };
}
