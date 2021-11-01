const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, unique: true },
  web3Address: String,
  joinTimestamp: Number
});

class UserModel {
  constructor() {
    this.model = mongoose.model("User", UserSchema);
  }

  addUser({ telegramId, web3Address }) {
    return Promise.resolve(
      this.model.create({ telegramId, web3Address, joinTimestamp: Date.now() })
    );
  }

  findAllUsers() {
    return Promise.resolve(this.model.find());
  }

  updateByTelegramId(telegramId, update) {
    return Promise.resolve(
      this.model.findOneAndUpdate({ telegramId }, update, { new: true })
    );
  }

  findFromTimeStamp(joinTimestamp) {
    return Promise.resolve(
      this.model.find({ joinTimestamp: { $gte: joinTimestamp } }).exec()
    );
  }
}

module.exports = UserModel;
