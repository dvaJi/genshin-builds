import { AxiomWebVitals } from "next-axiom";

import { PreloadResources } from "@app/preload-resources";

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
      <PreloadResources />
      <AxiomWebVitals />
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
