import { AppBackgroundStyle } from "@state/background-atom";

type Props = {
  bgStyle?: AppBackgroundStyle;
};

function DynamicBackground({ bgStyle }: Props) {
  // const appBackgroundStyle = useStore(background);

  return (
    <div className="">
      {bgStyle?.image && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-0 flex items-start justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover select-none"
            alt="Background image"
            src={bgStyle?.image}
          />
        </div>
      )}
      {bgStyle?.gradient && (
        <div
          className="pointer-events-none absolute top-0 left-0 h-full w-full"
          style={{ ...bgStyle?.gradient }}
        />
      )}
      {bgStyle?.stickyImage && (
        <div className="fixed z-0 flex w-full items-center justify-center">
          <img
            className="z-0 -mt-24 min-w-[900px] select-none"
            loading="lazy"
            alt="Background image"
            src={bgStyle?.stickyImage}
          />
        </div>
      )}
    </div>
  );
}

export default DynamicBackground;
