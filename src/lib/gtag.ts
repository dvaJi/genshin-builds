// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string, id: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", id, {
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
