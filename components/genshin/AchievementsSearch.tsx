import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { Checkbox } from "@app/components/ui/checkbox";
import Input from "@components/ui/Input";

interface Props {
  onSearch: (searchText: string) => void;
  onShowAchieved: () => void;
  showAchieved: boolean;
}

export default function AchievementsSearch({
  onSearch,
  onShowAchieved,
  showAchieved,
}: Props) {
  const t = useTranslations("Genshin.achievements");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, onSearch]);

  return (
    <div className="z-50 rounded-2xl border-card bg-card px-3 py-3 pb-2 shadow lg:sticky lg:top-12">
      <div className="flex flex-col gap-4 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            placeholder={t("search")}
            className="w-full pl-9"
          />
        </div>
        <div className="flex items-center">
          <label className="flex cursor-pointer items-center text-sm text-card-foreground">
            <Checkbox
              checked={showAchieved}
              onCheckedChange={onShowAchieved}
              className="mr-2"
            />
            {t("show_achieved")}
          </label>
        </div>
      </div>
    </div>
  );
}
