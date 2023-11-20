import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const X_GB_LANG_KEY = "x-gb-lang";
const i18n = {
  locales: [
    "en",
    "es",
    "ja",
    "cn",
    "zh-tw",
    "de",
    "fr",
    "id",
    "it",
    "ko",
    "pt",
    "ru",
    "th",
    "tr",
    "vi",
  ],
  defaultLocale: "en",
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.headers.has(X_GB_LANG_KEY)) {
    return response;
  }

  // Set default one
  const locale = getLocale(request);
  response.cookies.set(X_GB_LANG_KEY, locale);

  return response;
}

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale ?? i18n.defaultLocale;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/tof/:path*",
};
