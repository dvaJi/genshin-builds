import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { useEffect, useState } from "react";
import GenshinData from "genshin-data";

import Metadata from "@components/Metadata";
import SimpleRarityBox from "@components/SimpleRarityBox";
import SearchInput from "@components/SearchInput";
import Card from "@components/ui/Card";

import { localeToLang } from "@utils/locale-to-lang";
import useDebounce from "@hooks/use-debounce";
import useIntl from "@hooks/use-intl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getAllMaterialsMap, Material } from "@utils/materials";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  materials: Material[];
};

const MaterialsPage = ({ materials }: Props) => {
  const [filteredMaterials, setMaterials] = useState(materials);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { t } = useIntl("materials");

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
      })
    );
  }, [debouncedSearchTerm, materials]);

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Genshin Impact Materials List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Discover all the Materials",
        })}
      />
      <Ads className="my-0 mx-auto" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <h2 className="my-6 text-2xl font-semibold text-gray-200">
        {t({ id: "materials", defaultMessage: "Materials" })}
      </h2>
      <Card>
        <SearchInput
          value={searchTerm}
          setValue={setSearchTerm}
          placeholder={t({ id: "search", defaultMessage: "Search..." })}
        />
        <div className="flex flex-wrap justify-center">
          {filteredMaterials.map((material) => (
            <div key={material.id}>
              <SimpleRarityBox
                img={getUrl(`/${material.type}/${material.id}.png`, 120, 120)}
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
      </Card>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(locale, "genshin");
  const genshinData = new GenshinData({ language: localeToLang(locale) });
  const materialsMap = await getAllMaterialsMap(genshinData);

  return {
    props: {
      materials: Object.keys(materialsMap).map((key) => ({
        ...materialsMap[key],
        id: key,
      })),
      lngDict,
    },
  };
};

export default MaterialsPage;
