import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const LayoutFooter = () => {
  const router = useRouter();
  return (
    <footer className="z-20 border-t border-gray-700 border-opacity-50 bg-vulcan-800 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">TOFBuilds</h4>
            <Link href="/privacy-policy">
              <a className="my-2">Privacy Policy</a>
            </Link>
            <Link href="/contact">
              <a className="my-2">Contact</a>
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="en">
              <a className="my-2">English</a>
            </Link>
            <Link href={router.asPath} locale="es">
              <a className="my-2">Español</a>
            </Link>
            <Link href={router.asPath} locale="ja">
              <a className="my-2">日本語</a>
            </Link>
            <Link href={router.asPath} locale="de">
              <a className="my-2">Deutsch</a>
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="fr">
              <a className="my-2">Français</a>
            </Link>
            <Link href={router.asPath} locale="id">
              <a className="my-2">Indonesia</a>
            </Link>
            <Link href={router.asPath} locale="pt">
              <a className="my-2">Português</a>
            </Link>
            <Link href={router.asPath} locale="th">
              <a className="my-2">ภาษาไทย</a>
            </Link>
          </div>
          <div className="flex-1">
            <p className="text-sm">
              TOFBuilds is a Database, Tier List, and Guide for Tower of
              Fantasy.
            </p>
            <p className="mt-3 text-sm">
              TOFBuilds is not endorsed by mHotta Studio or Perfect World, and
              does not reflect the views or opinions of Hotta Studio or Perfect
              World or anyone officially involved in producing or managing Tower
              of Fantasy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(LayoutFooter);
