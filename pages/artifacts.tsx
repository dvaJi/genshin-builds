import { GetStaticProps } from "next";

import artifactsData from "../utils/artifacts.json";
import { Artifact } from "../interfaces/artifacts";

type Props = {
  artifacts: Artifact[];
};

const ArtifactsPage = ({ artifacts }: Props) => (
  <div>
    <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
      Artifacts
    </h2>
    <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-vulcan-800 relative">
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
  return { props: { artifacts }, revalidate: 1 };
};

export default ArtifactsPage;
