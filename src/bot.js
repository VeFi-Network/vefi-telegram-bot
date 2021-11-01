const { Telegraf } = require("telegraf");
const log = require("debug")("bot");
const { default: web3 } = require("web3");
const environment = require("./env");
const bot = new Telegraf(environment.BOT_TOKEN);
const strings = require("./strings");
const exec = require("./executors");

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
      await exec.addUser({ telegramId, web3Address });
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
      await exec.updateUser(telegramId, { web3Address });
    } catch (error) {
      ctx.reply(error.message);
      log(error.message);
    }
  });
};
