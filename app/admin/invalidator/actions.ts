"use server";

import { i18n } from "@i18n-config";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const invalidateSchema = z.object({
  type: z.string(z.enum(["tag", "path"])),
  value: z.string(),
});

export async function invalidateAction(_prevState: any, formData: FormData) {
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
    // Check if path is specific to a language
    const lang = parse.data.value.split("/")[1];

    if (i18n.locales.includes(lang as any)) {
      revalidatePath(parse.data.value);
      return { message: "success" };
    }

    // If not, invalidate all languages
    for (const lang of i18n.locales) {
      revalidatePath(`/${lang}${parse.data.value}`);
    }

    return { message: "success" };
  }

  return { error: "unknown type" };
}
