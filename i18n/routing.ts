import { defineRouting } from "next-intl/routing";

import { i18n } from "./config";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: i18n.locales,

  // Used when no locale matches
  defaultLocale: i18n.defaultLocale,
});
