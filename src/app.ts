`use strict`;

import * as express from "express";
import * as pty from "pty.js";
const chalk = require("chalk");

import {
  WalletBackend,
  ConventionalDaemon,
  BlockchainCacheApi
} from "turtlecoin-wallet-backend";

const app = express();
const expressWs = require("express-ws")(app);

app.use(express.static(`${__dirname}/public`));

// Connect to TurtlePay Cache
const daemon: BlockchainCacheApi = new BlockchainCacheApi(
  "blockapi.turtlepay.io",
  true
);

// Create wallet
expressWs.app.ws("/create", async (ws, req) => {
  const wallet: WalletBackend = WalletBackend.createWallet(daemon);
  const [seed, err] = wallet.getMnemonicSeed();
  const address = wallet.getPrimaryAddress();
  const [
    privateSpendKey,
    privateViewKey
  ] = wallet.getPrimaryAddressPrivateKeys();

  await wallet.start();

  ws.send(`\r\n ${chalk.bold(`Address`)}
    \r\n ${chalk.greenBright(address)}
    \r\n ${chalk.bold(`Private Spend Key`)}
    \r\n ${chalk.greenBright(privateSpendKey)}
    \r\n ${chalk.bold(`Private View Key`)}
    \r\n ${chalk.greenBright(privateViewKey)}
    \r\n ${chalk.bold(`Mnemonic Seed`)}
    \r\n ${chalk.greenBright(seed)}
  `);

  ws.close();

  // Make sure to call stop to let the node process exit
  wallet.stop();
});

// Start the server
app.listen(3000);
