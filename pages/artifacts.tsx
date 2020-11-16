import { GetStaticProps } from "next";

import artifactsData from "../utils/artifacts.json";
import { Artifact } from "../interfaces/artifacts";

type Props = {
  artifacts: Artifact[];
};

const ArtifactsPage = ({ artifacts }: Props) => (
  <div>
    <h2>Weaponms</h2>
    <div>
      <ul>
        {artifacts.map((artifact) => (
          <li key={artifact.id}>{artifact.name}</li>
        ))}
      </ul>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const artifacts = artifactsData as Artifact[];
  return { props: { artifacts } };
};

export default ArtifactsPage;
