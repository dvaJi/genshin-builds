'use client';

import { useMobileDetect } from "@hooks/use-mobile-detect";
import { GiCustomMap } from "@lib/guides_api";
import { CRS, divIcon } from "leaflet";
import { ImageOverlay, MapContainer, Marker } from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Props = {
  data: GiCustomMap;
};

const CustomMap = ({ data }: Props) => {
  const { isMobile, isLargeDesktop, innerWidth } = useMobileDetect();
  let sizes = {
    height: isMobile ? innerWidth : 315,
  };

  if (isLargeDesktop) {
    sizes = {
      height: 700,
    };
  }

  return (
    <MapContainer
      center={[0, -0]}
      zoom={3}
      maxZoom={6}
      doubleClickZoom={!1}
      scrollWheelZoom={true}
      style={{ width: "100%", height: sizes.height }}
      crs={CRS.Simple}
    >
      <ImageOverlay
        url={data.imageOverlay}
        zIndex={10}
        bounds={[
          [-100, 100],
          [100, -100],
        ]}
      />
      {data.marks.map((mark) => (
        <Marker
          key={mark.join("-")}
          position={mark as any}
          icon={divIcon({
            className: "map-marker",
            html: `<img class="map-marker__img" src="${data.markIcon}" />
            <img class="map-marker__arrow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAMAAABigZc2AAAAgVBMVEVHcEwyOUcyOUYwNUUyOkYyOEUyOUcwOEgyOUcxOUcxOUYxOUYxOUczOUcxOEYwOEgyOEYwQEAyOUcwO0hM//8yOUc4anVJ5ugzRVJBqK5AqK81UV49j5g8g4xH2tw7g4w4a3U6d4BK8/M9kJc1Ul5CtbpFztFAqa5EwcY/nKM6doH1Bg1hAAAAFHRSTlMAcO8wf2DvIN+/78/fv6BAgBCvX25tPkoAAACdSURBVCjPpdDZEoIwDAXQiJa24m6CYBH39f8/0BawQMqbeTxzk8lcAD5jFdA2Jk4TujFba7o+iJ3K9vjq2YhMifjumNR0viBiMW1Dsd1zc5y1oXRXEaZJTatfyJl2slQ+5E0oOnCz30dZzg3kgk5N9JP4X4Rqov4XF53XVzs/V50Yi89+B1JRjnfWldxQUQ50agIDEYVmj8IAwh/zBTZ9DfdiYeMTAAAAAElFTkSuQmCC" />`,
            iconSize: [90, 90],
          })}
        />
      ))}
    </MapContainer>
  );
};

export default CustomMap;
