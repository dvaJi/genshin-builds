"use client";

import useIntl from "@hooks/use-intl";
import useServerTime from "@hooks/use-server-time";

function ServerTimers() {
  const { tfn } = useIntl("ascension_planner");
  const { NARemaining, EURemaining, AsiaRemaining } = useServerTime();

  return (
    <div className="mb-4 grid lg:grid-cols-3">
      <div className="card text-center lg:mr-2">
        <div className="text-xl">
          {tfn({ id: "europe", defaultMessage: "Europe" })}
        </div>
        <div>{EURemaining}</div>
      </div>
      <div className="card text-center lg:mr-2">
        <div className="text-xl">
          {tfn({ id: "north_america", defaultMessage: "North America" })}
        </div>
        <div>{NARemaining}</div>
      </div>
      <div className="card text-center">
        <div className="text-xl">
          {tfn({ id: "asia", defaultMessage: "Asia" })}
        </div>
        <div>{AsiaRemaining}</div>
      </div>
    </div>
  );
}

export default ServerTimers;
