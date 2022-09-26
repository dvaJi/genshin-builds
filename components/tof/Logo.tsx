import { memo } from "react";

const Logo = () => {
  return (
    <>
      {/* <img
        src="/logo.png"
        className="ml-5 lg:ml-0 lg:mr-5 fill-current text-white"
        alt="TOFBuilds logo"
      />
      <span className="text-gray-100 text-lg font-normal hidden">
        TOFBuilds
      </span> */}
      <span className="text-sky-600">TOF</span> Builds
      <span className="text-sm text-slate-400">.com</span>
    </>
  );
};

export default memo(Logo);
