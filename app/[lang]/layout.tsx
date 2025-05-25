import NextTopLoader from "nextjs-toploader";

import { Toaster } from "@app/components/ui/sonner";
import { PreloadResources } from "@app/preload-resources";
import { FormbricksProvider } from "@components/Formbricks";

import ExternalScripts from "./scripts";

export default async function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      {process.env.IS_DEV_ENV ? (
        <head>
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        </head>
      ) : null}
      <PreloadResources />
      <ExternalScripts />
      <FormbricksProvider />
      <body suppressHydrationWarning>
        <NextTopLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
