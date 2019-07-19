import { toJS, autorun, set } from "mobx";

const defaultProducers = [
  "alohaeosprod",
  "argentinaeos",
  "aus1genereos",
  "blockmatrix1",
  "blocksmithio",
  "cryptolions1",
  "cypherglasss",
  "eos42freedom",
  "eosamsterdam",
  "eosauthority",
  "eoscafeblock",
  "eoscanadacom",
  "eosdacserver",
  "eosdublinwow",
  "eosflareiobp",
  "eosiodetroit",
  "eosliquideos",
  "eosmetaliobp",
  "eosnairobike",
  "eosnationftw",
  "eosnewyorkio",
  "eosphereiobp",
  "eosriobrazil",
  "eosswedenorg",
  "eosukblocpro",
  "eosvenezuela",
  "hkeoshkeosbp",
  "itokenpocket",
  "teamgreymass",
  "tokenika4eos"
];

export default function(_this) {
  let firstRun = true;

  // will run on change
  autorun(() => {
    // on load check if there's an existing store on localStorage and extend the store
    if (firstRun) {
      let producers = defaultProducers;
      try {
        const existingProducers = localStorage.getItem("selectedProducers");
        if (existingProducers) {
          producers = JSON.parse(existingProducers);
        }
        if(producers.length === 0) {
          producers = defaultProducers
        }
      } catch {}

      set(_this.selectedProducers, producers);
    }

    // from then on serialize and save to localStorage
    localStorage.setItem(
      "selectedProducers",
      JSON.stringify(toJS(_this.selectedProducers))
    );
  });

  firstRun = false;
}
