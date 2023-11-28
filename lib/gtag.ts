export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const TOF_GA_TRACKING_ID = process.env.NEXT_PUBLIC_TOF_GA_ID;
export const HSR_GA_TRACKING_ID = process.env.NEXT_PUBLIC_HSR_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  // console.log(url);
  if (typeof window !== "undefined" && (window as any).gtag) {
    let gaTrackingID = GA_TRACKING_ID;
    const isTOF = url.startsWith("/tof");
    const isHSR = url.startsWith("/hsr");

    if (isTOF) {
      gaTrackingID = TOF_GA_TRACKING_ID;
    } else if (isHSR) {
      gaTrackingID = HSR_GA_TRACKING_ID;
    }

    window.gtag("config", gaTrackingID, {
      page_path: url,
    });
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
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

export const trackClick = (label: string) => {
  event({ action: "click", category: "button", label });
};
