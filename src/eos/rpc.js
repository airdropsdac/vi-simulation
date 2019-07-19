import { JsonRpc } from 'eosjs';

const createNetwork = (nodeEndpoint, chainId) => {
  const matches = /^(https?):\/\/(.+):(\d+)\D*$/.exec(nodeEndpoint);
  if (!matches) {
    throw new Error(
      `Could not parse EOS HTTP endpoint. Needs protocol and port: "${nodeEndpoint}"`,
    );
  }

  const [, httpProtocol, host, port] = matches;

  return {
    chainId,
    protocol: httpProtocol,
    host,
    port: Number.parseInt(port, 10),
    nodeEndpoint,
  };
};

const MainNetwork = createNetwork(
  `https://public.eosinfra.io:443`,
  `aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906`,
);

const rpc = new JsonRpc(MainNetwork.nodeEndpoint);

export default rpc;
