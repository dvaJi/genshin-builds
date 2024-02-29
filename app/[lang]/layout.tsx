import { PreloadResources } from "@app/preload-resources";

export default function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <PreloadResources />
      <script data-cfasync="false" src="/adb.js" async />
      <body>{children}</body>
    </html>
  );
}
