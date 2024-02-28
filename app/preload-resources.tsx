"use client";

import ReactDOM from "react-dom";

export function PreloadResources() {
  ReactDOM.preconnect("https://a.pub.network", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://b.pub.network", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://c.pub.network", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://d.pub.network", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://c.amazon-adsystem.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://s.amazon-adsystem.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://secure.quantserve.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://rules.quantcount.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://pixel.quantserve.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://cmp.quantcast.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://btloader.com", { crossOrigin: "anonymous" });
  ReactDOM.preconnect("https://api.btloader.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://confiant-integrations.global.ssl.fastly.net", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://securepubads.g.doubleclick.net", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://pagead2.googlesyndication.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://eus.rubiconproject.com", {
    crossOrigin: "anonymous",
  });
  ReactDOM.preconnect("https://pixel.rubiconproject.com", {
    crossOrigin: "anonymous",
  });

  return null;
}
