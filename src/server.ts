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
const socket = require("express-ws")(app);

app.use(express.static(`${__dirname}/client`));

// Connect to TurtlePay Cache
const daemon: BlockchainCacheApi = new BlockchainCacheApi(
  "blockapi.turtlepay.io",
  true
);

// Create wallet
socket.app.ws("/create", async (ws, req) => {
  const wallet: WalletBackend = WalletBackend.createWallet(daemon);
  const [seed, err] = wallet.getMnemonicSeed();
  const address = wallet.getPrimaryAddress();
  const [
    privateSpendKey,
    privateViewKey
  ] = wallet.getPrimaryAddressPrivateKeys();

  await wallet.start();

  ws.send(`\n 
   \n ${chalk.yellowBright.bold(
     `Welcome to your new wallet! Here is your payment address: `
   )}
   \n ${chalk.greenBright(address)}
   \n
   \n ${chalk.redBright.bold(
     `Please record your secret keys and mnemonic seed and store them in a secure location.`
   )}
   \n ${chalk.bold(`Private Spend Key:`)}
   \n ${chalk.greenBright(privateSpendKey)}
   \n ${chalk.bold(`Private View Key:`)}
   \n ${chalk.greenBright(privateViewKey)}
   \n ${chalk.bold(`Mnemonic Seed:`)}
   \n ${chalk.greenBright(seed)}
  `);

  ws.close();

  // Make sure to call stop to let the node process exit
  wallet.stop();
});

// Start the server
app.listen(3000);
