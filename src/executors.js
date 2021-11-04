const db = require("./db");

module.exports.addUser = async function (params) {
  const user = await db.models.users.addUser(params);

  if (user.toJSON) return user.toJSON();

  return user;
};

module.exports.findByTelegramId = async function (telegramId) {
  const user = await db.models.users.findByTelegramId(telegramId);

  if (user.toJSON) return user.toJSON();

  return user;
};

module.exports.findAllAndLimit = async function (page, limit) {
  const all = await db.models.users.findAllUsers();
  return all
    .map(item => {
      if (item.toJSON) {
        return item.toJSON();
      }
      return item;
    })
    .slice((page - 1) * limit, page * limit);
};

module.exports.findAll = async function () {
  const all = await db.models.users.findAllUsers();
  return all.map(item => {
    if (item.toJSON) return item.toJSON();

    return item;
  });
};

module.exports.findFromTimestampAndLimit = async function (
  timestamp,
  page,
  limit
) {
  const all = await db.models.users.findFromTimeStamp(timestamp);
  return all
    .map(item => {
      if (item.toJSON) return item.toJSON();

      return item;
    })
    .slice((page - 1) * limit, page * limit);
};

module.exports.findFromTimestamp = async function (timestamp) {
  const all = await db.models.users.findFromTimeStamp(timestamp);
  return all.map(item => {
    if (item.toJSON) return item.toJSON();
    return item;
  });
};

module.exports.updateUser = function (telegramId, update) {
  return db.models.users.updateByTelegramId(telegramId, update);
};
