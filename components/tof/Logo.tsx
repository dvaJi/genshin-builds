import { memo } from "react";

const Logo = () => {
  return (
    <div className="mr-6 flex items-center font-bold text-white w-max text-xl">
      {/* <img
        src="/logo.png"
        className="ml-5 lg:ml-0 lg:mr-5 fill-current text-white"
        alt="TOFBuilds logo"
      />
      <span className="text-gray-100 text-lg font-normal hidden">
        TOFBuilds
      </span> */}
      <div>
        <span className="text-sky-600">TOF</span>
        <span>-Builds</span>
        <span className="text-sm text-slate-400">.com</span>
      </div>
    </div>
  );
};

export default memo(Logo);
