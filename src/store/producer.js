import { observable, computed, toJS } from "mobx";
import BigNumber from "bignumber.js";

class Producer {
  @observable data = null;
  @observable _name = null;
  @observable _rank = null;
  rootStore = null;

  constructor({ name, rank, data, rootStore }) {
    this._name = name;
    this._rank = rank;
    this.data = data;
    this.rootStore = rootStore;
  }

  @computed get name() {
    return this._name || this.data.owner;
  }

  @computed get rank() {
    return this._rank;
  }

  @computed get contract() {
    return this.data.owner;
  }

  @computed get totalVotes() {
    return new BigNumber(this.data.total_votes);
  }

  @computed get votePercentageRelativeTop200() {
    const top200VoteStrength = this.rootStore.originalProducers.reduce((acc, p) => acc.plus(p.totalVotes), new BigNumber(0))
    return this.totalVotes.div(top200VoteStrength)
  }

  @computed get votePercentage() {
    return this.totalVotes.div(this.rootStore.totalVoteWeight);
  }

  @computed get vpayRewards() {
    const bpRewardPool = this.rootStore.bpRewardPool;
    const vpay = this.votePercentage * bpRewardPool.vpay;
    return vpay >= 100 * 1e4 ? vpay : 0
  }

  @computed get rewards() {
    const bpRewardPool = this.rootStore.bpRewardPool;
    let rewards = 0;

    if (this.rank <= 21) rewards += bpRewardPool.bpay / 21;

    rewards += this.vpayRewards

    return rewards;
  }

  @computed get isSelected() {
    return this.rootStore.selectedProducers.some(p => p === this.contract)
  }
}

export default Producer;
