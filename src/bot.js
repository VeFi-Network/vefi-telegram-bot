const { Telegraf } = require("telegraf");
const log = require("debug")("bot");
const Web3 = require("web3");
const environment = require("./env");
const bot = new Telegraf(environment.BOT_TOKEN);
const strings = require("./strings");
const exec = require("./executors");
const abi = require("./TokenABI.json");

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/bsc/mainnet"
);

module.exports = function () {
  bot.start(ctx => ctx.reply(strings.HELP));
  bot.hears(/(\/help)/, ctx => ctx.reply(strings.HELP));
  bot.hears(/(\/address) .*/, async ctx => {
    const message = ctx.message.text;
    const msgArgs = message.split(" ");
    const web3Address = msgArgs[1];
    const telegramId = ctx.from.username;
    try {
      if (!web3Address || !web3.utils.isAddress(web3Address.toLowerCase()))
        throw new Error("invalid address");
      const user = await exec.addUser({ telegramId, web3Address });
      ctx.reply(`Successfully added address: ${user.web3Address}`);
      log(`Added user: ${JSON.stringify(user, null, 2)}`);
    } catch (error) {
      ctx.reply(error.message);
      log(error.message);
    }
  });
  bot.hears(/(\/updateAddress) .*/, async ctx => {
    const message = ctx.message.text;
    const msgArgs = message.split(" ");
    const web3Address = msgArgs[1];
    const telegramId = ctx.from.username;
    try {
      if (!web3Address || !web3.utils.isAddress(web3Address.toLowerCase()))
        throw new Error("invalid address");
      const user = await exec.updateUser(telegramId, { web3Address });
      ctx.reply(`Successfully updated address: ${user.web3Address}`);
      log(`Updated user: ${JSON.stringify(user, null, 2)}`);
    } catch (error) {
      ctx.reply(error.message);
      log(error.message);
    }
  });

  bot.hears(/(\/balance)/, async ctx => {
    const telegramId = ctx.from.username;
    try {
      const user = await exec.findByTelegramId(telegramId);

      if (!user) throw new Error("user hasn't associated an address yet");

      const contract = new web3.eth.Contract(
        abi,
        "0x1515B7652185388925F5D8283496753883416f09"
      );
      const balance = await contract.methods.balanceOf(user.web3Address).call();
      ctx.reply(
        `VEF balance for ${telegramId}: ${(
          parseInt(balance.toString()) /
          10 ** 18
        ).toFixed(2)}`
      );
    } catch (error) {
      ctx.reply(error.message);
      log(error.message);
    }
  });
  bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
