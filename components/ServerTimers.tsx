"use client";

import useIntl from "@hooks/use-intl";
import useServerTime from "@hooks/use-server-time";

function ServerTimers() {
  const { tfn } = useIntl("ascension_planner");
  const {
    NARemaining,
    NAWeekRemaining,
    EURemaining,
    EUWeekRemaining,
    AsiaRemaining,
    AsiaWeekRemaining,
  } = useServerTime();

  return (
    <div className="mb-4 grid lg:grid-cols-3 md:gap-4">
      <div className="card text-center">
        <div className="text-xl text-slate-200">
          {tfn({ id: "europe", defaultMessage: "Europe" })}{" "}
          <span className="text-sm">(GMT+1)</span>
        </div>
        <div>Servers daily reset in {EURemaining}</div>
        <div>Servers weekly reset in {EUWeekRemaining}</div>
      </div>
      <div className="card text-center">
        <div className="text-xl text-slate-200">
          {tfn({ id: "north_america", defaultMessage: "North America" })}{" "}
          <span className="text-sm">(GMT-5)</span>
        </div>
        <div>Servers daily reset in {NARemaining}</div>
        <div>Servers weekly reset in {NAWeekRemaining}</div>
      </div>
      <div className="card text-center">
        <div className="text-xl text-slate-200">
          {tfn({ id: "asia", defaultMessage: "Asia" })}{" "}
          <span className="text-sm">(GMT+8)</span>
        </div>
        <div>Servers daily reset in {AsiaRemaining}</div>
        <div>Servers weekly reset in {AsiaWeekRemaining}</div>
      </div>
    </div>
  );
}

export default ServerTimers;
