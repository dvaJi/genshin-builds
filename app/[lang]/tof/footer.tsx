import Link from "next/link";

export default function Footer() {
  return (
    <footer className="z-20 border-t border-gray-700 border-opacity-50 bg-vulcan-800 px-20 py-14 text-gray-400">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-gray-200">TOFBuilds</h4>
            <Link href="/privacy-policy" className="my-2" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="/contact" className="my-2" prefetch={false}>
              Contact
            </Link>
          </div>
          <div className="flex flex-1 flex-col"></div>
          <div className="flex-1">
            <p className="text-sm">
              TOFBuilds is a Database, Tier List, and Guide for Tower of
              Fantasy.
            </p>
            <p className="mt-3 text-xs">
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
}
