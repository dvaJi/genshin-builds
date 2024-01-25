import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
  var freestar: any;

  interface Window {
    gtag(command: "config", trackingId: string, config: GtagConfig): void;
    gtag(command: "event", eventAction: string, event: GtagEvent): void;
    gtag(...args: any[]): void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
      GENSHIN_API_URL: string;
      HSR_API_URL: string;
      NEXT_PUBLIC_BLOG_CONTENT_TL_PROMPT: string;
    }
  }
}

interface GtagEvent {
  event_category: string;
  event_label?: string;
  value?: number;
}

interface GtagConfig {
  page_title?: string;
  page_path?: string;
  send_page_view?: boolean;
}
