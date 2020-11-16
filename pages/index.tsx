import { GetStaticProps } from "next";
import Link from "next/link";

import weaponsData from "../utils/weapons.json";
import { Weapon } from "../interfaces/weapon";

type Props = {
  weapons: Weapon[];
};

const WithStaticProps = ({ weapons }: Props) => (
  <div>
    <h2>Weaponms</h2>
    <div>
      <ul>
        {weapons.map((weapon) => (
          <li key={weapon.id}>{weapon.name}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const weapons = weaponsData as Weapon[];
  return { props: { weapons } };
};

export default WithStaticProps;
