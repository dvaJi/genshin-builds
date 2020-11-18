import Link from "next/link";

interface LayoutHeaderProps {}

export const LayoutHeader: React.FC<LayoutHeaderProps> = () => {
  return (
    <aside className="z-20 hidden w-64 overflow-y-auto bg-vulcan-800 md:block flex-shrink-0">
      <div className="py-4 text-gray-400">
        <Link href="/">
          <a className="ml-6 text-lg font-bold text-gray-200">Genshin Builds</a>
        </Link>
        <ul className="mt-6">
          <li className="relative px-6 py-3">
            <span
              className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
            <Link href="/comp-builder">
              <a className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200 text-gray-100">
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span className="ml-4">Team Builder</span>
              </a>
            </Link>
          </li>
        </ul>
        {/* <ul>
          <li className="relative px-6 py-3">
            <a
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200"
              href="forms.html"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="ml-4">Forms</span>
            </a>
          </li>
          <li className="relative px-6 py-3">
            <a
              className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-200"
              href="cards.html"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="ml-4">Cards</span>
            </a>
          </li>
        </ul> */}
      </div>
    </aside>
  );
};
