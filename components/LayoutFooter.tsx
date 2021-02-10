import Link from "next/link";
import { useRouter } from "next/router";
import { memo } from "react";

const LayoutFooter = () => {
  const router = useRouter();
  return (
    <footer className="px-20 py-14 bg-vulcan-800 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row">
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
            <Link href={router.asPath} locale="jp">
              <a className="my-2">日本語</a>
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
