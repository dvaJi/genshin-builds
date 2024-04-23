import { NextRequest, NextResponse } from "next/server";

import { invalidateAction } from "@app/admin/invalidator/actions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = {
    type: body.type as string,
    value: body.value as string,
    token: body.token as string,
  };

  if (data.token !== process.env.NEWS_API_KEY) {
    return NextResponse.json(
      { error: "invalid token provided" },
      { status: 401 }
    );
  }

  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("value", data.value);

  const res = await invalidateAction({}, formData);

  return NextResponse.json({ res }, { status: 200 });
}
