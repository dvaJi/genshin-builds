/* eslint-disable react/jsx-key */
import clsx from "clsx";
import { GetStaticProps } from "next";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import SimpleRarityBox from "@components/SimpleRarityBox";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT, IMGS_CDN } from "@lib/constants";
import { useLocalStorage } from "@hooks/use-local-storage";

type Reward = {
  id: string;
  amount: number;
  rarity: number;
};

type Code = {
  code: string;
  rewards: Reward[];
};

type Props = {
  codes: Code[];
};

const Codes = ({ codes }: Props) => {
  const [codesChecked, setCheckCodes] = useLocalStorage(
    "codes",
    {} as Record<string, Code>
  );
  const { t } = useIntl();

  const toggleCodes = (code: Code) => {
    let newCheckCodes = { ...codesChecked };

    if (newCheckCodes[code.code]) {
      delete newCheckCodes[code.code];
    } else {
      newCheckCodes[code.code] = code;
    }

    setCheckCodes(newCheckCodes);
  };

  return (
    <div>
      <Metadata
        fn={t}
        pageTitle={t({
          id: "title.codes",
          defaultMessage: "Genshin Impact Codes – free primogems and mora",
        })}
        pageDescription={t({
          id: "title.codes.description",
          defaultMessage:
            "We round up the latest Genshin Impact codes, so you can get freebies",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "codes", defaultMessage: "Codes" })}
      </h2>
      <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-vulcan-800 relative">
        <ul>
          {codes.map((code) => (
            <li
              key={code.code}
              className="flex px-4 py-2 bg-vulcan-700 hover:bg-vulcan-600 rounded my-2 cursor-pointer items-center"
              onClick={() => toggleCodes(code)}
            >
              <div className="inline-block">
                <input
                  type="checkbox"
                  checked={Object.keys(codesChecked).includes(code.code)}
                  onChange={() => toggleCodes(code)}
                />
              </div>
              <div
                className={clsx("inline-block text-xl mx-2", {
                  "line-through": Object.keys(codesChecked).includes(code.code),
                })}
              >
                {code.code}
              </div>
              <div className="inline-block text-sm">
                {code.rewards.map((reward) => (
                  <div
                    key={reward.id + code.code}
                    className="inline-block mr-2"
                  >
                    <SimpleRarityBox
                      img={`${IMGS_CDN}/materials/${reward.id}.png`}
                      rarity={reward.rarity}
                      name={reward.amount.toString()}
                      className="h-10 w-10"
                    />
                  </div>
                ))}
              </div>
              <div
                className={clsx(
                  "float-right bg-vulcan-800 text-xs p-1 rounded transition-all transform",
                  Object.keys(codesChecked).includes(code.code)
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-3"
                )}
              >
                Claimed
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  const codes = require(`../_content/data/codes.json`) as Code[];

  return { props: { codes, lngDict }, revalidate: 1 };
};

export default Codes;
