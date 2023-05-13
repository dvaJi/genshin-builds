import { getHsrUrl } from "@lib/imgUrl";

type Props = {
  stars: number;
};

function Stars({ stars }: Props) {
  return (
    <div className="flex flex-row" title={`${stars} stars`}>
      {Array.from(Array(stars).keys()).map((_, i) => (
        <img
          key={i}
          src={getHsrUrl("/star.png")}
          alt="star"
          className="h-4 w-4 select-none"
        />
      ))}
    </div>
  );
}

export default Stars;
