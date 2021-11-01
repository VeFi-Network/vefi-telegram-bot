const { Telegraf } = require("telegraf");
const environment = require("./env");
const bot = new Telegraf(environment.BOT_TOKEN);
const strings = require("./strings");

module.exports = function () {
  bot.start(ctx => ctx.reply(strings.HELP));
  bot.hears(/(\/help)/, ctx => ctx.reply(strings.HELP));
};
