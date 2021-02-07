import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import App from "../components/App";

import "../styles/globals.css";

function Root(props: AppProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <RecoilRoot>
        <App {...props} />
      </RecoilRoot>
    </DndProvider>
  );
}

export default Root;
