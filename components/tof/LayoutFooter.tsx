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
            <Link href="/privacy-policy" className="my-2">
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-2">
              Contact
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="en" className="my-2">
              English
            </Link>
            <Link href={router.asPath} locale="es" className="my-2">
              Español
            </Link>
            <Link href={router.asPath} locale="ja" className="my-2">
              日本語
            </Link>
            <Link href={router.asPath} locale="de" className="my-2">
              Deutsch
            </Link>
          </div>
          <div className="flex flex-1 flex-col">
            <Link href={router.asPath} locale="fr" className="my-2">
              Français
            </Link>
            <Link href={router.asPath} locale="id" className="my-2">
              Indonesia
            </Link>
            <Link href={router.asPath} locale="pt" className="my-2">
              Português
            </Link>
            <Link href={router.asPath} locale="th" className="my-2">
              ภาษาไทย
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
