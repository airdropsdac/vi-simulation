import BigNumber from "bignumber.js";
import cloneDeep from "lodash/cloneDeep";
import { action, computed, observable } from "mobx";
import { decomposeAsset } from "../eos/asset.js";
import { fetchRows } from "../eos/utils";
import { calculateVoteWeight } from "../math.js";
import bpMapping from "./bpMapping.json";
import Producer from "./producer.js";
import SimulatedProducer from "./simulatedProducer.js";
import autoSave from './autoSave'

const INFLATION = 0.05;
const BP_SHARE = 0.2;
const VPAY_SHARE = 0.75;
const BPAY_SHARE = 0.25;

class RootStore {
  @observable tableEosStat = null;
  @observable tableGlobal = null;
  @observable _originalProducers = [];

  constructor() {
    autoSave(this)
  }

  @action async init() {
    this.fetchBPInfo();
  }

  @action async fetchBPInfo() {
    this.tableEosStat = (await fetchRows({
      code: `eosio.token`,
      table: `stat`,
      scope: `EOS`
    }))[0];
    this.tableGlobal = (await fetchRows({
      code: `eosio`,
      table: `global`,
      scope: `eosio`
    }))[0];
    const tableProducers = await fetchRows({
      code: `eosio`,
      table: `producers`,
      scope: `eosio`,
      limit: 200,
      index_position: 2,
      key_type: `float64`
    });

    this._originalProducers = tableProducers.map((data, index) => {
      return new Producer({
        name: bpMapping[data.owner],
        rank: index + 1,
        data,
        rootStore: this
      });
    });
  }

  @computed get originalProducers() {
    return this._originalProducers;
  }

  @computed get totalVoteWeight() {
    if (!this.tableGlobal) return new BigNumber(0);

    return new BigNumber(this.tableGlobal.total_producer_vote_weight);
  }

  @computed get bpRewardPool() {
    if (!this.tableEosStat)
      return {
        vpay: 0,
        bpay: 0
      };

    const supply = decomposeAsset(this.tableEosStat.supply).amount;
    const dailyRewardPool = (supply * INFLATION * BP_SHARE) / 365;

    return {
      vpay: dailyRewardPool * VPAY_SHARE,
      bpay: dailyRewardPool * BPAY_SHARE
    };
  }

  /* General Info */
  @observable valueProxyVotes = "10000000";
  @observable valueVPayFeesPercentage = "0.9";
  @observable valueTop21Fee = "100";
  @observable valueMaintenaceFeesPercentage = "0.02";

  @computed get valueProxyVotesAsEOS() {
    return Math.floor(parseFloat(this.valueProxyVotes) * 1e4);
  }

  @computed get valueTop21FeeAsEOS() {
    return Math.floor(parseFloat(this.valueTop21Fee) * 1e4);
  }

  @computed get valueProxyVoteWeight() {
    return calculateVoteWeight(this.valueProxyVotesAsEOS);
  }

  @computed get valueVPayPerBP() {
    const rewardPool = this.bpRewardPool;
    return Math.floor(
      (this.valueProxyVoteWeight / this.totalVoteWeight) * rewardPool.vpay
    );
  }

  @computed get valueTotalVPay() {
    const selectedSimulated = this._simulatedProducers.filter(p => p.isSelected)
    return selectedSimulated.reduce((acc, p) => acc + p.vpayDueToProxy, 0)
  }

  @computed get valueNumberOfNewlyTop21Bps() {
    const selectedSimulated = this._simulatedProducers.filter(p => p.isSelected)
    return selectedSimulated.reduce((acc, p) => acc + ((p.rank <= 21 && p.originalBP.rank > 21) ? 1 : 0), 0)
  }

  @computed get valueProxyEarnings() {
    return (
      this.valueNumberOfNewlyTop21Bps * this.valueTop21FeeAsEOS +
      this.valueTotalVPay * this.valueVPayFeesPercentage
    );
  }

  @computed get valueMaintenanceFeesAsEOS() {
    return Math.floor(
      this.valueProxyEarnings * this.valueMaintenaceFeesPercentage
    );
  }

  @computed get valueAPR() {
    const dailyPercentage =
      (this.valueProxyEarnings - this.valueMaintenanceFeesAsEOS) /
      this.valueProxyVotesAsEOS;
    return dailyPercentage * 365;
  }

  @action handleProxyVotesChange = evt => {
    this.valueProxyVotes = evt.target.value;
  };

  @action handleVPayFeesPercentage = evt => {
    this.valueVPayFeesPercentage = evt.target.value;
  };

  @action handleTop21Fee = evt => {
    this.valueTop21Fee = evt.target.value;
  };

  @action handleMaintenanceFeesPercentage = evt => {
    this.valueMaintenaceFeesPercentage = evt.target.value;
  };

  /* Original BPs */
  @observable selectedProducers = [];

  @action handleToggleProducer = producer => {
    if (this.selectedProducers.some(p => p === producer)) {
      this.selectedProducers = this.selectedProducers.filter(
        p => p !== producer
      );
    } else {
      this.selectedProducers = [...this.selectedProducers, producer];
    }
  };

  @action handleDeselectProducers = () => {
    this.selectedProducers = [];
  };

  @computed get canSelectMoreProducers() {
    return this.selectedProducers.length < 30;
  }

  /* Simulated BPs */
  @observable showSelectedOnly = true;

  @action handleToggleShowSelectedOnly = () => {
    this.showSelectedOnly = !this.showSelectedOnly;
  };

  @computed get _simulatedProducers() {
    return this.originalProducers
      .map(
        p =>
          new SimulatedProducer({
            name: p.name,
            data: cloneDeep(p.data),
            rootStore: this
          })
      )
      .sort((p1, p2) => p2.totalVotes.minus(p1.totalVotes).toNumber());
  }

  @computed get simulatedProducersFiltered() {
    return this._simulatedProducers.filter(
      p => !this.showSelectedOnly || p.isSelected
    );
  }
}

export default RootStore;
