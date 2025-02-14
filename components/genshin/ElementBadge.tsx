import { Badge } from "@app/components/ui/badge";
import { cn } from "@app/lib/utils";
import { capitalize } from "@utils/capitalize";

import ElementIcon from "./ElementIcon";

type Props = {
  element: {
    id: string;
    name: string;
  };
};
export function ElementBadge({ element }: Props) {
  return (
    <Badge
      variant="secondary"
      className={cn("text-xxs sm:text-xs", {
        "bg-green-900/50 text-green-400": element.id === "dendro",
        "bg-cyan-900/50 text-cyan-400": element.id === "cryo",
        "bg-purple-900/50 text-purple-400": element.id === "electro",
        "bg-yellow-900/50 text-yellow-400": element.id === "geo",
        "bg-blue-900/50 text-blue-400": element.id === "hydro",
        "bg-red-900/50 text-red-400": element.id === "pyro",
        "bg-emerald-900/50 text-emerald-400": element.id === "anemo",
      })}
    >
      <ElementIcon
        className="mr-1"
        type={capitalize(element.id)}
        width={16}
        height={16}
      />
      {element.name}
    </Badge>
  );
}
