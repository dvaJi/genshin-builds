export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const TOF_GA_TRACKING_ID = process.env.NEXT_PUBLIC_TOF_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  console.log(url);
  if (typeof window !== "undefined" && (window as any).gtag) {
    const isTOF = url.startsWith("/tof");
    (window as any).gtag(
      "config",
      isTOF ? TOF_GA_TRACKING_ID : GA_TRACKING_ID,
      {
        page_path: url,
      }
    );
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
interface EventProps {
  action: string;
  category: string;
  label: string;
  value?: number;
}
export const event = ({ action, category, label, value }: EventProps) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

export const trackClick = (label: string) => {
  event({ action: "click", category: "button", label });
};
