`use strict`;

import * as express from "express";
import * as pty from "pty.js";
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

  await wallet.start();

  ws.send("\r\n");

  ws.send(wallet.getPrimaryAddress());
  ws.send("\r\n");
  ws.send("\r\n");

  ws.send(`Private: ${wallet.getPrivateViewKey()}`);
  ws.send(" \r\n");
  ws.send(`Public: ${wallet.getSpendKeys(wallet.getPrimaryAddress())}`);

  // Make sure to call stop to let the node process exit
  wallet.stop();
});

// Start the server
app.listen(3000);
