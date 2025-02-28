"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import formbricks from "@formbricks/js";

export function FormbricksProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID) {
      console.warn(
        "Formbricks is not initialized. Please set NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID in your .env file.",
      );
      return;
    }
    // Initialize Formbricks
    formbricks.init({
      environmentId: process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID || "",
      apiHost:
        process.env.NEXT_PUBLIC_FORMBRICKS_API_HOST ||
        "https://app.formbricks.com",
    });

    // Optional: Identify the current user
    // formbricks.identify("user-id-1", {
    //   email: "user@example.com",
    //   name: "John Doe",
    //   // Add any custom attributes
    // });
  }, []);

  useEffect(() => {
    // This will ensure page view is tracked on route changes
    if (pathname && process.env.NEXT_PUBLIC_FORMBRICKS_ENVIRONMENT_ID) {
      formbricks.registerRouteChange();
    }
  }, [pathname, searchParams]);

  return null;
}
