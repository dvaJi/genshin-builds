import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { submitGenshinUID, submitHSRUID } from "@app/actions";

export const runtime = "edge";

const ProfileSchema = z.object({
  uid: z.string(),
  game: z.enum(["genshin", "hsr"]),
});

export async function POST(req: NextRequest) {
  const searchParams = await req.json();
  const validated = ProfileSchema.safeParse(searchParams);

  if (!validated.success) {
    return NextResponse.json(
      { error: "invalid data provided" },
      { status: 400 },
    );
  }

  const { data } = validated;

  const formData = new FormData();
  formData.append("uid", data.uid);

  if (data.game === "genshin") {
    const res = await submitGenshinUID({}, formData);
    return NextResponse.json(res);
  } else if (data.game === "hsr") {
    const res = await submitHSRUID({}, formData);
    return NextResponse.json(res);
  }

  return NextResponse.json({ error: "Invalid game" }, { status: 400 });
}
