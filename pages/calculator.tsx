/* eslint-disable react/jsx-key */
import clsx from "clsx";
import { GetStaticProps } from "next";

import Ads from "@components/Ads";
import Metadata from "@components/Metadata";
import SimpleRarityBox from "@components/SimpleRarityBox";

import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { useLocalStorage } from "@hooks/use-local-storage";
import { getUrl } from "@lib/imgUrl";

type Props = {};

const Calculator = ({}: Props) => {
  const { t } = useIntl();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div>
            <div>Calculate Ascnesion materials?</div>
            <div>
              <select>
                <option>Hu tao</option>
              </select>
            </div>
            <div>
              <span>Current character Level, Exp, and ascension</span>
              <div>
                <input type="number" />
              </div>
              <div>
                <input type="number" />
              </div>
            </div>
            <div>
              <span>Expected level</span>
              <div>
                <input type="number" />
              </div>
            </div>
          </div>
          <div>
            <span>Itms</span>
            <div>Hero`s Wit</div>
            <div>Adventurer`s Experience</div>
            <div>Wanderer`s Advice</div>
            <div>Calculate talent ascension materials</div>
            <div className="grid grid-cols-3">
              <input type="number" />
              <input type="number" />
              <input type="number" />
            </div>
            <div className="grid grid-cols-3">
              <input type="number" />
              <input type="number" />
              <input type="number" />
            </div>
          </div>
          <div>
            <button>Calculate</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale);

  return { props: { lngDict } };
};

export default Calculator;
