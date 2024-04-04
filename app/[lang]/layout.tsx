import { AxiomWebVitals } from "next-axiom";

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
      <AxiomWebVitals />
      <body>{children}</body>
    </html>
  );
}
