import { AppBackgroundStyle } from "@state/background-atom";

type Props = {
  bgStyle?: AppBackgroundStyle;
};

function DynamicBackground({ bgStyle }: Props) {
  // const appBackgroundStyle = useStore(background);

  return (
    <>
      {bgStyle?.image && (
        <div className="pointer-events-none absolute top-0 left-0 right-0 bottom-0 z-0 flex items-start justify-center overflow-hidden">
          <img
            className="w-full scale-100 md:scale-100"
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
        <div
          className="absolute top-0 left-0 right-0 bottom-0 z-0 h-full overflow-hidden bg-fixed bg-center bg-no-repeat lg:h-[1300px]"
          style={{
            backgroundImage: `url('${bgStyle?.stickyImage}')`,
          }}
        />
      )}
    </>
  );
}

export default DynamicBackground;
