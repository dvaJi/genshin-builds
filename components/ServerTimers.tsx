import useIntl from "@hooks/use-intl";
import useServerTime from "@hooks/use-server-time";
import Card from "./ui/Card";

function ServerTimers() {
  const { tfn } = useIntl("ascension_planner");
  const { NARemaining, EURemaining, AsiaRemaining } = useServerTime();

  return (
    <div className="grid lg:grid-cols-3 mb-4">
      <Card className="text-center lg:mr-2">
        <div className="text-xl">
          {tfn({ id: "europe", defaultMessage: "Europe" })}
        </div>
        <div>{EURemaining}</div>
      </Card>
      <Card className="text-center lg:mr-2">
        <div className="text-xl">
          {tfn({ id: "north_america", defaultMessage: "North America" })}
        </div>
        <div>{NARemaining}</div>
      </Card>
      <Card className="text-center">
        <div className="text-xl">
          {tfn({ id: "asia", defaultMessage: "Asia" })}
        </div>
        <div>{AsiaRemaining}</div>
      </Card>
    </div>
  );
}

export default ServerTimers;
