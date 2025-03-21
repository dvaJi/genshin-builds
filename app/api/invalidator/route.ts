import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { invalidateAction } from "@app/admin/invalidator/actions";

export const runtime = "edge";

const InvalidatorSchema = z.object({
  type: z.string(),
  value: z.string(),
  token: z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = InvalidatorSchema.safeParse(body);

  if (!data.success) {
    return NextResponse.json(
      { error: "invalid data provided" },
      { status: 400 },
    );
  }

  if (data.data.token !== process.env.NEWS_API_KEY) {
    return NextResponse.json(
      { error: "invalid token provided" },
      { status: 401 },
    );
  }

  const formData = new FormData();
  formData.append("type", data.data.type);
  formData.append("value", data.data.value);

  const res = await invalidateAction({}, formData);

  return NextResponse.json({ res }, { status: 200 });
}
