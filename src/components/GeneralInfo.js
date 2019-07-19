import React from "react";
import { inject, observer } from "mobx-react";
import styled from "styled-components";
import { Block, Header, HorizontalFlex } from "./styles";
import { EOS_SYMBOL } from "../constants";
import { formatAsset } from "../eos/asset";

const Label = styled.label`
  margin-right: 1rem;
  width: 150px;
`

const Input = styled.input`
  background: #fff;
  border: none;
  font-size: 1rem;
  padding: 0.25rem;
  margin: 0;
  text-align: right;
  &:read-only {
    color: #999;
  }
  flex: 1;
  min-width: 200px;
`

class GeneralInfo extends React.Component {
  render() {
    const { rootStore } = this.props;

    return (
      <Block>
        <Header>General Info</Header>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Proxy EOS Votes:</Label>
          <Input value={rootStore.valueProxyVotes} onChange={rootStore.handleProxyVotesChange} placeholder="25000000.0000"/>
        </HorizontalFlex>
        {/* <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Proxy Vote Weight:</Label>
          <Input value={rootStore.valueProxyVoteWeight.toFixed(0)} readOnly />
        </HorizontalFlex> */}
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>BP VPAY % to Proxy:</Label>
          <Input value={rootStore.valueVPayFeesPercentage} onChange={rootStore.handleVPayFeesPercentage} placeholder="0.7" />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Proxy Maintenance Fees in %:</Label>
          <Input value={rootStore.valueMaintenaceFeesPercentage} onChange={rootStore.handleMaintenanceFeesPercentage} placeholder="0.7" />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Fixed EOS fee for entering Top 21:</Label>
          <Input value={rootStore.valueTop21Fee} onChange={rootStore.handleTop21Fee} placeholder="0.7" />
        </HorizontalFlex>
        <hr />
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Additional BP VPay from Proxy Votes:</Label>
          <Input value={`${formatAsset({ amount: rootStore.valueVPayPerBP, symbol: EOS_SYMBOL })}`} readOnly />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Additional VPay of all BPs in Proxy:</Label>
          <Input value={`${formatAsset({ amount: rootStore.valueTotalVPay, symbol: EOS_SYMBOL })}`} readOnly />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>#BPs in Proxy newly in Top 21:</Label>
          <Input value={`${rootStore.valueNumberOfNewlyTop21Bps}`} readOnly />
        </HorizontalFlex>
        <hr />
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Proxy Earnings:</Label>
          <Input value={`${formatAsset({ amount: rootStore.valueProxyEarnings, symbol: EOS_SYMBOL })}`} readOnly />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Maintenace Fee:</Label>
          <Input value={`${formatAsset({ amount: rootStore.valueMaintenanceFeesAsEOS, symbol: EOS_SYMBOL })}`} readOnly />
        </HorizontalFlex>
        <HorizontalFlex justifyContent="flex-start" margin="0 0 1rem 0">
          <Label>Voter Incentives APR:</Label>
          <Input value={`${(rootStore.valueAPR * 100).toFixed(4)}%`} readOnly />
        </HorizontalFlex>
      </Block>
    );
  }
}

export default inject("rootStore")(observer(GeneralInfo));
