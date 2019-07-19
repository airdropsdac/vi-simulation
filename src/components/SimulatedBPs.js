import { inject, observer } from "mobx-react";
import React from "react";
import styled from "styled-components";
import { EOS_SYMBOL } from "../constants";
import { formatAsset } from "../eos/asset";
import { Block, Header, HorizontalFlex } from "./styles";
import { vote2stake } from "../math";

const List = styled.ol`
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 1rem 0;
`;

const PText = styled.span`
  display: inline-block;
  width: ${p => p.width || `200px`} !important;
  margin-right: 0.5rem;
  text-align: ${p => p.textAlign || `left`};
`;

const PRank = styled(PText)`
  color: ${p =>
    p.deltaRank === `0`
      ? `initial`
      : Number.parseInt(p.deltaRank) < 0
      ? `red`
      : `green`};
`;

const PName = styled(PText)`
  color: ${p => (p.highlight ? `blue` : `initial`)};
`;

const PRewards = styled(PText)`
  color: ${p =>
    p.deltaRewards === `0`
      ? `initial`
      : Number.parseInt(p.deltaRewards) < 0
      ? `red`
      : `green`};
  white-space: pre;
`;

const Label = styled.label``;

const Info = styled.p`
  font-size: 0.8rem;
  text-align: center;
`;

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
`;

class OriginalBps extends React.Component {
  render() {
    const { rootStore } = this.props;

    return (
      <Block>
        <Header>Simulated Results</Header>
        <Info>Assuming votes to proxy are redistributed from all BPs proportional to their vote weight. (1% of total votes = 1% of Proxy Vote Weight lost.)</Info>
        <HorizontalFlex>
          <Label>Show selected BPs only: </Label>
          <input
            type="checkbox"
            checked={rootStore.showSelectedOnly}
            onChange={() => rootStore.handleToggleShowSelectedOnly()}
          />
        </HorizontalFlex>
        <List>
          {rootStore.simulatedProducersFiltered.map(p => (
            <ListItem key={p.contract}>
              <PRank width="4rem" textAlign="left" deltaRank={p.deltaRank}>
                {`${p.rank} (${p.deltaRank})`}
              </PRank>
              <PName
                width="150px"
                highlight={!rootStore.showSelectedOnly && p.isSelected}
              >
                {p.name}
              </PName>
              <PText width="80px">
                {`${(vote2stake(p.totalVotes) / 1e10).toFixed(2)}M (${(
                  p.votePercentage.toNumber() * 100
                ).toFixed(2)})%`}
              </PText>
              <PRewards
                width="8rem"
                textAlign="right"
                deltaRewards={p.deltaRewards}
              >
                {`${formatAsset({
                  amount: p.rewards,
                  symbol: EOS_SYMBOL
                })}\n${p.deltaRewards > 0 ? `+` : ``}${formatAsset({
                  amount: p.deltaRewards,
                  symbol: EOS_SYMBOL
                })}`}
              </PRewards>
            </ListItem>
          ))}
        </List>
      </Block>
    );
  }
}

export default inject("rootStore")(observer(OriginalBps));
