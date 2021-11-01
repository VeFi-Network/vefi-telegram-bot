const { Transaction: Tx } = require("ethereumjs-tx");
const { default: Web3 } = require("web3");
const exec = require("../executors");
const env = require("../env");

const web3 = new Web3("");
const airdrop = new web3.eth.Contract(null, env.CONTRACT_ADDRESS);

class API {
  static async addEligibleCandidates(request, response) {
    try {
      const all = (
        await exec.findAllAndLimit(
          parseInt(request.query.page || "1"),
          parseInt(request.query.limit || "2000")
        )
      ).map(item => ({
        _recipient: item.web3Address,
        _amount: web3.utils.toWei("5000")
      }));
      const nonce = web3.utils.toHex(
        await web3.eth.getTransactionCount(env.ETH_ADDRESS)
      );
      const data = airdrop.methods.addRecipients(all).encodeABI();
      const opts = {
        nonce,
        data,
        to: env.CONTRACT_ADDRESS,
        gasLimit: web3.utils.toHex(request.body.gasLimit),
        gasPrice: web3.utils.toHex(
          web3.utils.toWei(request.body.gasPrice.toString(), "gwei")
        )
      };
      const tx = new Tx(opts);
      tx.sign(Buffer.from(request.body.pk, "hex"));
      const rawHash = "0x".concat(tx.serialize().toString("hex"));
      const result = await web3.eth.sendSignedTransaction(rawHash);
      return response.status(200).json({ result });
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  }
}

module.exports = API;
