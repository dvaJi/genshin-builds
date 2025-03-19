"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import SearchInput from "@components/SearchInput";
import SimpleRarityBox from "@components/SimpleRarityBox";
import useDebounce from "@hooks/use-debounce";
import { getUrl } from "@lib/imgUrl";
import { Material } from "@utils/materials";

type Props = {
  materials: Material[];
};

export default function GenshinMaterialsList({ materials }: Props) {
  const [filteredMaterials, setMaterials] = useState(materials);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const t = useTranslations("Genshin.materials");

  useEffect(() => {
    setMaterials(
      materials.filter((w) => {
        let nameFilter = true;
        let typeFil = true;
        if (debouncedSearchTerm) {
          nameFilter =
            w.name.toUpperCase().indexOf(debouncedSearchTerm.toUpperCase()) >
            -1;
        }

        return nameFilter && typeFil;
      }),
    );
  }, [debouncedSearchTerm, materials]);

  return (
    <div className="card">
      <SearchInput
        value={searchTerm}
        setValue={setSearchTerm}
        placeholder={t("search")}
      />
      <div className="flex flex-wrap justify-center">
        {filteredMaterials.map((material) => (
          <div key={material.id}>
            <SimpleRarityBox
              img={getUrl(`/materials/${material.id}.png`, 120, 120)}
              rarity={material.rarity}
              name={material.name}
              alt={material.name}
              nameSeparateBlock
              className="h-24 w-24"
              classNameBlock="w-24"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
