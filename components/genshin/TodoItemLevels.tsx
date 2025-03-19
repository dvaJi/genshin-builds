import { useTranslations } from "next-intl";
import { memo } from "react";
import { CgArrowLongRight } from "react-icons/cg";

import Image from "./Image";

type Props = {
  levels: [number, boolean, number, boolean];
};

function TodoItemLevels({ levels }: Props) {
  const t = useTranslations("Genshin.todo");

  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("levels")}
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
              alt={t("ascension")}
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
