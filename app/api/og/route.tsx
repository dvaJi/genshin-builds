import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

import { IMGS_CDN } from "@lib/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const font = fetch(
    new URL("@styles/cheltenham-italic-700.ttf", import.meta.url),
  ).then((res) => res.arrayBuffer());
  const image = searchParams.get("image");
  const title = searchParams.get("title");
  const description = searchParams.get("description");
  const fontData = await font;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundImage: `url(${IMGS_CDN + image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          fontWeight: 600,
          color: "white",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 35%)",
            fontWeight: 600,
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              position: "absolute",
              bottom: 80,
              left: 80,
              margin: 0,
              fontSize: 50,
              fontFamily: "NYT Cheltenham",
              maxWidth: 900,
              whiteSpace: "pre-wrap",
              letterSpacing: -1,
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: 50,
                fontFamily: "NYT Cheltenham",
                maxWidth: 900,
                whiteSpace: "pre-wrap",
                letterSpacing: -1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: 20,
                maxWidth: 900,
              }}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1050,
      height: 549,
      fonts: [
        {
          name: "NYT Cheltenham",
          data: fontData,
        },
      ],
    },
  );
}
