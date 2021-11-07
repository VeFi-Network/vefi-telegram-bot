const express = require("express");
const log = require("debug")("index");
const mongoose = require("mongoose");
const env = require("./env");
const startBot = require("./bot");
const router = require("./router");

const app = express();
const port = parseInt(process.env.PORT || "7800");

app.use(express.json());
app.use(router);

app.listen(port, () => {
  log(`Server is running on port ${port}`);
  mongoose.connect(env.DB_URI).then(() => {
    log("Connected to the db");
    startBot();
  });
});
