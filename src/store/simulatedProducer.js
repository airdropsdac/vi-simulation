import { observable, computed, toJS } from "mobx";
import BigNumber from "bignumber.js";
import Producer from "./producer";

export default class SimulatedProducer extends Producer {
  @computed get name() {
    return this._name || this.data.owner;
  }

  @computed get rank() {
    return (
      this.rootStore._simulatedProducers.findIndex(
        p => p.contract === this.contract
      ) + 1
    );
  }

  @computed get originalBP() {
    return this.rootStore.originalProducers.find(
      p => p.contract === this.contract
    );
  }

  @computed get deltaRank() {
    const delta = this.originalBP.rank - this.rank;

    if (delta <= 0) return `${delta}`;
    return `+${delta}`;
  }

  @computed get deltaRewards() {
    const delta = this.rewards - this.originalBP.rewards;
    return delta;
  }

  @computed get vpayDueToProxy() {
    if(!this.isSelected) return 0

    // if never earned any VPAY (<100 EOS), then we are responsible
    // for all of it and charge extra
    if(this.originalBP.vpayRewards === 0) return this.vpayRewards;

    // otherwise charge proportional to proxy votes
    return this.vpayRewards * (this.rootStore.valueProxyVoteWeight.div(this.totalVotes)).toNumber()
  }

  @computed get totalVotes() {
    const oldAdjustedVotes = this.originalBP.totalVotes.minus(
      this.originalBP.votePercentageRelativeTop200 *
        // assume totalVotes of originalProducers and simulatedProducers stays the same
        this.rootStore.selectedProducers.length *
        this.rootStore.valueProxyVoteWeight
    );

    if (!this.isSelected) return oldAdjustedVotes;

    return oldAdjustedVotes.plus(this.rootStore.valueProxyVoteWeight);
  }
}
