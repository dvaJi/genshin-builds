"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const invalidateSchema = z.object({
  type: z.string(z.enum(["tag", "path"])),
  value: z.string(),
});

export async function invalidateAction(prevState: any, formData: FormData) {
  console.log("invalidate", { formData });
  const parse = invalidateSchema.safeParse({
    type: formData.get("type"),
    value: formData.get("value"),
  });

  if (!parse.success) {
    return { message: parse.error.message };
  }

  if (parse.data.type === "tag") {
    revalidateTag(parse.data.value);
    return { message: "success" };
  } else if (parse.data.type === "path") {
    revalidatePath(parse.data.value);
    return { message: "success" };
  }

  return { error: "unknown type" };
}
