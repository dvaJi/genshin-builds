import dynamic from "next/dynamic";

const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

function Test() {
  return (
    <div>
      {process.env.NEXT_PUBLIC_FRST_PLACEMENTS &&
        process.env.NEXT_PUBLIC_FRST_PLACEMENTS.split(",").map((name) => (
          <FrstAds key={name} placementName={name} />
        ))}
    </div>
  );
}

export default Test;
