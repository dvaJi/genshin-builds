import { AppBackgroundStyle } from "@state/background-atom";

type Props = {
  bgStyle?: AppBackgroundStyle;
};

function DynamicBackground({ bgStyle }: Props) {
  // const appBackgroundStyle = useStore(background);

  return (
    <div className="flex flex-col">
      <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-0 flex items-start justify-center overflow-hidden">
        {bgStyle?.image && (
          <img
            className="w-full scale-100 md:scale-100"
            alt="Background image"
            src={bgStyle?.image}
          />
        )}
      </div>
      <div
        className="pointer-events-none absolute top-0 left-0 h-full w-full"
        style={{ ...bgStyle?.gradient }}
      />
    </div>
  );
}

export default DynamicBackground;
