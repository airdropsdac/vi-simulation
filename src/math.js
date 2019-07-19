import BigNumber from "bignumber.js";

// blocktimestamp_epoch counts from Jan 01 2000
// from https://www.eoscanada.com/en/how-is-your-vote-strength-calculated-on-eos
const SECONDS_TO_2000 = 946684800;
const SECONDS_PER_WEEK = 60 * 60 * 24 * 7;

// https://github.com/EOSIO/eos/blob/2ad412773d6ccc72045dae760ae3d81cf229c8ee/contracts/eosio.system/voting.cpp#L105-L108
export function calculateVoteWeight(staked) {
  const timestamp = Date.now() / 1000;
  const weight = (
    Math.floor((timestamp - SECONDS_TO_2000) / SECONDS_PER_WEEK) * (1.0 / 52.0)
  );

  return new BigNumber(staked).times(Math.pow(2, weight))
}

export function vote2stake(voteWeight) {
  const timestamp = Date.now() / 1000;
  const weight = (
    Math.floor((timestamp - SECONDS_TO_2000) / SECONDS_PER_WEEK) * (1.0 / 52.0)
  );

  return new BigNumber(voteWeight).div(Math.pow(2, weight))
}

export function calculateVoteDecayPercentage(staked, lastVoteWeight) {
  const voteWeight = calculateVoteWeight(staked)

  return (((voteWeight - lastVoteWeight) / voteWeight) * 100)
}
