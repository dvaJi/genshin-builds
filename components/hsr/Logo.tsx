import { memo } from "react";

const Logo = () => {
  return (
    <div className="mr-6 flex w-max items-center text-xl font-bold text-white">
      {/* <img
        src="/logo.png"
        className="ml-5 lg:ml-0 lg:mr-5 fill-current text-white"
        alt="Star Rail Builds logo"
      />
      <span className="text-gray-100 text-lg font-normal hidden">
        Star Rail Builds
      </span> */}
      <div>
        <span className="text-hsr-accent">Star Rail </span>
        <span>Builds</span>
        {/* <span className="text-sm text-slate-400">.com</span> */}
      </div>
    </div>
  );
};

export default memo(Logo);
