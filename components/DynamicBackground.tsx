import { useStore } from "@nanostores/react";

import { background } from "@state/background-atom";

function DynamicBackground() {
  const appBackgroundStyle = useStore(background);

  return (
    <div className="flex flex-col">
      <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-0 flex items-start justify-center overflow-hidden">
        {appBackgroundStyle.image && (
          <img
            className="w-full scale-100 md:scale-100"
            alt="Background image"
            src={appBackgroundStyle.image}
          />
        )}
      </div>
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-full"
        style={{ ...appBackgroundStyle.gradient }}
      ></div>
    </div>
  );
}

export default DynamicBackground;
