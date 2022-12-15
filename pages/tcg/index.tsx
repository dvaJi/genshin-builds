import Link from "next/link";
import { GetStaticProps } from "next";
import GenshinData, { type TCGCard } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Ads from "@components/ui/Ads";
import Metadata from "@components/Metadata";
import Card from "@components/ui/Card";

import { localeToLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";

type Props = {
  cards: TCGCard[];
  types: string[];
  factions: string[];
  energies: string[];
  costs: string[];
};

const TcgPage = ({ cards }: Props) => {
  const { t } = useIntl("tcg_cards");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genius Invokation TCG Card Game",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "Genius Invokation TCG is a new card game feature in Genshin Impact. Guide includes what is the Genius Invocation TCG, character card game, how to get cards!",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "cards", defaultMessage: "Cards" })}
      </h2>
      {/* <div>
        <div>
          <select>
            <option value="all">All</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>{factions.join()},Other Factions</div>
        <div>{energies.join()}</div>
        <div>{costs.join()}</div>
      </div> */}
      <Card>
        <div className="flex flex-wrap content-center justify-center">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/tcg/card/${card.id}`}
              className="group relative m-2 w-20 cursor-pointer transition-all hover:scale-110"
            >
              <LazyLoadImage
                src={getUrl(`/tcg/${card.id}.png`, 90, 90)}
                placeholderSrc={getUrl(`/tcg/${card.id}.png`, 4, 4)}
                alt={card.name}
                title={card.name}
                width={80}
                height={134}
                className="rounded-lg border-2 border-transparent transition-all group-hover:border-white group-hover:brightness-125"
              />
              <div className="mt-1 text-center text-xs transition-all group-hover:text-white">
                {card.name}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const cards = await genshinData.tcgCards();

  // Gather all types from card.attributes.card_type without duplicates
  const types = cards
    .map((card) => card?.attributes?.card_type)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  // Gather all energies from card.attributes.energy without duplicates
  const energies = cards
    .map((card) => card?.attributes?.energy)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  // Gather all costs from card.attributes.cost without duplicates
  const costs = cards
    .map((card) => card?.attributes?.cost)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  // Gather all factions from card.attributes.faction without duplicates, faction is an array of strings
  const factions = cards
    .flatMap((card) => card?.attributes?.faction)
    .filter((value, index, self) => value && self.indexOf(value) === index);

  return {
    props: { cards, types, factions, energies, costs, lngDict },
  };
};

export default TcgPage;
