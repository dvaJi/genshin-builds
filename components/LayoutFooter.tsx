import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const LayoutFooter = () => {
  const router = useRouter();
  return (
    <footer className="px-20 py-14 bg-vulcan-800 text-gray-400 border-t border-gray-700 border-opacity-50">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col">
            <h4 className="text-gray-200 mb-3">GenshinBuilds</h4>
            <Link href="/privacy-policy">
              <a className="my-2">Privacy Policy</a>
            </Link>
            <Link href="/contact">
              <a className="my-2">Contact</a>
            </Link>
          </div>
          <div className="flex-1 flex flex-col">
            <Link href={router.asPath} locale="en">
              <a className="my-2">English</a>
            </Link>
            <Link href={router.asPath} locale="es">
              <a className="my-2">Español</a>
            </Link>
            <Link href={router.asPath} locale="ja">
              <a className="my-2">日本語</a>
            </Link>
            <Link href={router.asPath} locale="zh-tw">
              <a className="my-2">中文（繁體）</a>
            </Link>
            <Link href={router.asPath} locale="de">
              <a className="my-2">Deutsch</a>
            </Link>
            <Link href={router.asPath} locale="fr">
              <a className="my-2">Français</a>
            </Link>
          </div>
          <div className="flex-1 flex flex-col">
            <Link href={router.asPath} locale="id">
              <a className="my-2">Indonesia</a>
            </Link>
            <Link href={router.asPath} locale="ko">
              <a className="my-2">한국어</a>
            </Link>
            <Link href={router.asPath} locale="pt">
              <a className="my-2">Português</a>
            </Link>
            <Link href={router.asPath} locale="ru">
              <a className="my-2">Pусский</a>
            </Link>
            <Link href={router.asPath} locale="th">
              <a className="my-2">ภาษาไทย</a>
            </Link>
            <Link href={router.asPath} locale="vi">
              <a className="my-2">Tiếng Việt</a>
            </Link>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              GenshinBuilds is a Database, Tier List, and Guide for Genshin
              Impact on PC, mobile and consoles.
            </p>
            <p className="text-sm mt-3">
              GenshinBuilds is not endorsed by miHoYo Co Ltd. and does not
              reflect the views or opinions of MiHoyo or anyone officially
              involved in producing or managing Genshin Impact.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(LayoutFooter);
