import useIntl from "@hooks/use-intl";
import Input from "./Input";

type Props = {
  onSearch: (searchText: string) => void;
  onShowAchieved: () => void;
  showAchieved: boolean;
};

const AchievementsSearch = ({
  onSearch,
  onShowAchieved,
  showAchieved,
}: Props) => {
  const { t } = useIntl("achievements");
  return (
    <div className="bg-vulcan-800 shadow rounded-2xl py-3 px-3 pb-2 z-50 lg:sticky lg:top-12">
      <div className="flex items-center">
        <div className="relative">
          <Input
            type="text"
            className="pr-8 w-32 sm:w-64"
            placeholder={t({ id: "search", defaultMessage: "Search" })}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="ml-auto">
          <label className="flex items-center">
            <input
              className="mr-2 w-4 h-4"
              type="checkbox"
              checked={showAchieved}
              onChange={onShowAchieved}
            />
            {t({ id: "show_achieved", defaultMessage: "Show Achieved" })}
          </label>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSearch;
