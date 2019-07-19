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

const Label = styled.label``;

const Button = styled.button`
  font-size: 1rem;
  margin: 1rem;
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
        <Header>BPs</Header>
        <HorizontalFlex>
          <Label>{`#Selected BPs: ${
            rootStore.selectedProducers.length
          }`}</Label>
        </HorizontalFlex>
        <HorizontalFlex>
          <Button onClick={rootStore.handleDeselectProducers}>
            Deselect all
          </Button>
        </HorizontalFlex>
        <List>
          {rootStore.originalProducers.map(p => (
            <ListItem key={p.contract}>
              <input
                type="checkbox"
                checked={p.isSelected}
                onChange={() => rootStore.handleToggleProducer(p.contract)}
                disabled={!p.isSelected && !rootStore.canSelectMoreProducers}
              />
              <PText width="2rem" textAlign="left">
                {p.rank}
              </PText>
              <PText width="150px">{p.name}</PText>
              <PText width="150px">{p.contract}</PText>
              <PText width="80px">
                {`${(vote2stake(p.totalVotes) / 1e10).toFixed(2)}M (${(
                  p.votePercentage.toNumber() * 100
                ).toFixed(2)})%`}
              </PText>
              <PText width="8rem" textAlign="right">
                {formatAsset({ amount: p.rewards, symbol: EOS_SYMBOL })}
              </PText>
            </ListItem>
          ))}
        </List>
      </Block>
    );
  }
}

export default inject("rootStore")(observer(OriginalBps));
