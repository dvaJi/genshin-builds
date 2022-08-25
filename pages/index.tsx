import { GetStaticProps } from "next";
import AscensionPlanner, {
  getStaticProps as plannerProps,
} from "./ascension-planner";

const IndexPage = (props: any) => {
  return <AscensionPlanner {...props} />;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return plannerProps(ctx);
};

export default IndexPage;
