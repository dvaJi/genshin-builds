import type { TCGCard } from "@interfaces/genshin";
import { getUrl } from "@lib/imgUrl";

type Props = {
  card: TCGCard;
};

function TCGCard({ card }: Props) {
  function getEnergy(card: TCGCard) {
    if (Array.isArray(card.attributes.energy)) {
      return card.attributes.energy.length > 0
        ? card.attributes.energy
        : [{ _id: -1, id: "same", type: "Same", count: 0 }];
    } else {
      // Generate array based on card.attributes.energy
      const energy = card.attributes.energy || 0;
      const energyArray = Array.from({ length: energy }, (_, i) => i);
      return energyArray.map((i) => ({
        _id: i,
        id: "energy_card",
        type: "Energy",
        count: "",
      }));
    }
  }

  return (
    <>
      {card.attributes.hp ? (
        <div className="absolute left-0 top-0 z-10 -mx-1 -my-2">
          <img
            src={getUrl(`/tcg/hp.png`, 24, 29)}
            alt="HP"
            className="w-6"
            width="24"
            height="29"
          />
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
            <p className="font-bold text-white shadow-yellow-950 text-shadow-sm">
              {card.attributes.hp}
            </p>
          </div>
        </div>
      ) : null}

      {getEnergy(card).map((energy, i) => (
        <div
          key={energy.id + i}
          className="absolute -right-2 z-10"
          style={{ top: `${i * 20 + 5}px` }}
        >
          <img
            src={getUrl(`/tcg/${energy.id}.png`, 20, 20)}
            alt={energy.type}
            className="-mb-1 w-5"
            width="20"
            height="20"
          />
          <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center pt-1">
            <p className="text-xxs font-bold text-white shadow-black text-shadow-sm">
              {energy.count}
            </p>
          </div>
        </div>
      ))}
      <img
        src={getUrl(`/tcg/${card.id}.png`, 150, 90)}
        alt={card.name}
        title={card.name}
        width={80}
        height={134}
        className="rounded-lg transition-all group-hover:brightness-125"
      />
      <div className="absolute bottom-0 w-full rounded-b-lg bg-vulcan-900 bg-opacity-70 p-1 text-center text-xxs text-slate-200">
        {card.name}
      </div>
    </>
  );
}

export default TCGCard;
