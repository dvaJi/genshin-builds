import { NextRequest, NextResponse } from "next/server";

import { submitGenshinUID, submitHSRUID } from "@app/actions";

export async function POST(req: NextRequest) {
  const searchParams = await req.json();
  const data = {
    uid: searchParams.uid as string,
    game: searchParams.game as string,
  };

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
