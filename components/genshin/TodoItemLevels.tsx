import { memo } from "react";
import { CgArrowLongRight } from "react-icons/cg";

import useIntl from "@hooks/use-intl";

import Image from "./Image";

type Props = {
  levels: [number, boolean, number, boolean];
};

function TodoItemLevels({ levels }: Props) {
  const { t } = useIntl("todo");

  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t({
          id: "levels",
          defaultMessage: "Levels",
        })}
      </div>
      <div className="flex items-center space-x-2 text-sm font-medium">
        <span>{levels[0]}</span>
        <CgArrowLongRight className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center">
          <span>{levels[2]}</span>
          {levels[3] && (
            <Image
              src="/ascension.png"
              className="ml-1 h-3 w-3"
              alt="ascension"
              width={16}
              height={16}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(TodoItemLevels);
