import { observer, Provider as MobxProvider } from "mobx-react";
import React from "react";
import styled from "styled-components";
import GlobalStyles from "./global-styles";
import RootStore from "./store";
import GeneralInfo from "./components/GeneralInfo";
import OriginalBPs from "./components/OriginalBPs";
import SimulatedBPs from "./components/SimulatedBPs";
import { formatAsset } from "./eos/asset";
import { EOS_SYMBOL } from "./constants";

const rootStore = new RootStore();

window.rootStore = rootStore; // just for in-browser debugging, not used in the code

const PageWrapper = styled.div`
  margin: 2rem;
  display: flex;
  flex-direction: row;
`;

class App extends React.Component {
  componentDidMount() {
    rootStore.init();
  }

  render() {
    return (
      <MobxProvider rootStore={rootStore}>
        <React.Fragment>
          <GlobalStyles />

          <PageWrapper>
            <GeneralInfo />
           <OriginalBPs />
           <SimulatedBPs />
          </PageWrapper>
        </React.Fragment>
      </MobxProvider>
    );
  }
}

export default observer(App);
