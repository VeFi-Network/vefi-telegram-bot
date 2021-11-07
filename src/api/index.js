const { Transaction: Tx } = require("ethereumjs-tx");
const Web3 = require("web3");
const exec = require("../executors");
const abi = require("../AirdropABI.json");

const web3 = new Web3(
  "https://speedy-nodes-nyc.moralis.io/558120230227a848a2bb7043/bsc/mainnet"
);
const airdrop = new web3.eth.Contract(
  abi,
  "0x4dCE4c7902fed6f3874901348595505B32752e05"
);

class API {
  static async addEligibleCandidates(request, response) {
    try {
      const all = (
        await exec.findAllAndLimit(
          parseInt(request.query.page || "1"),
          parseInt(request.query.limit || "100")
        )
      ).map(item => ({
        _recipient: item.web3Address,
        _amount: web3.utils.toWei(request.body.amountEach)
      }));
      const nonce = web3.utils.toHex(
        await web3.eth.getTransactionCount(request.body.address)
      );
      const data = airdrop.methods.addRecipients(all).encodeABI();
      const opts = {
        nonce,
        data,
        to: "0x4dCE4c7902fed6f3874901348595505B32752e05",
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
