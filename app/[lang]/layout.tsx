// import { i18n } from "../../i18n-config";

// export async function generateStaticParams() {
//   return i18n.locales.map((locale) => ({ lang: locale }));
// }

export const viewport = {
  colorScheme: 'dark',
}

const preconnects = [
  "https://a.pub.network/",
  "https://b.pub.network/",
  "https://c.pub.network/",
  "https://d.pub.network/",
  "https://c.amazon-adsystem.com",
  "https://s.amazon-adsystem.com",
  "https://secure.quantserve.com/",
  "https://rules.quantcount.com/",
  "https://pixel.quantserve.com/",
  "https://cmp.quantcast.com/",
  "https://btloader.com/",
  "https://api.btloader.com/",
  "https://confiant-integrations.global.ssl.fastly.net",
];

export default function Root({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      {preconnects.map((url) => (
        <link key={url} rel="preconnect" href={url} crossOrigin="anonymous" />
      ))}
      <body>{children}</body>
    </html>
  );
}
