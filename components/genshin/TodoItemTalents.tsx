import { useTranslations } from "next-intl";
import { memo } from "react";
import { CgArrowLongRight } from "react-icons/cg";

type Props = {
  talents: Record<string, [number, number]>;
};

function TodoItemTalents({ talents }: Props) {
  const t = useTranslations("Genshin.todo");

  if (Object.keys(talents).length === 0) return null;

  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("talents")}
      </div>
      <div className="space-y-1">
        {Object.entries(talents).map(([id, value]) => (
          <div key={id} className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <span>{value[0]}</span>
              <CgArrowLongRight className="mx-2 h-3 w-3 text-muted-foreground" />
              <span>{value[1]}</span>
            </div>
            <span className="text-xs text-muted-foreground">{t(id)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TodoItemTalents);
