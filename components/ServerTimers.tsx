import useServerTime from "@hooks/use-server-time";

const ServerTimers = () => {
  const { NARemaining, EURemaining, AsiaRemaining } = useServerTime();

  return (
    <div className="grid grid-cols-3 ">
      <div className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800 text-center mr-2">
        <div className="text-xl">Europe</div>
        <div>{EURemaining}</div>
      </div>
      <div className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800 text-center">
        <div className="text-xl">North America</div>
        <div>{NARemaining}</div>
      </div>
      <div className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800 text-center ml-2">
        <div className="text-xl">Asia</div>
        <div>{AsiaRemaining}</div>
      </div>
    </div>
  );
};

export default ServerTimers;
