import { i18n } from "i18n-config";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

export default async function Contact() {
  return (
    <div>
      <h1 className="mb-2 ml-4 text-3xl text-white lg:ml-0">Contact</h1>
      <div className="card">
        <div>
          I made this app in my free tune and also it is open source.
          you&apos;re free to report an issue, propose an idea, ask for a
          feature or anything to improve the app in my github:{" "}
          <a href="https://github.com/dvaJi/genshin-builds">Github</a>
          or send an email to genshinbuildscom@gmail.com
        </div>
      </div>
    </div>
  );
}
