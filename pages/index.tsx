import { GetServerSideProps } from "next";
import AscensionPlanner, {
  getServerSideProps as plannerProps,
} from "./ascension-planner";

const IndexPage = (props: any) => {
  return <AscensionPlanner {...props} />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return plannerProps(ctx);
};

export default IndexPage;
