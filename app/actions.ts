"use server";

import { cookies } from "next/headers";

export async function setLanguage(lang: string) {
  const cookieStore = cookies();
  cookieStore.set("x-gb-lang", lang);
}
