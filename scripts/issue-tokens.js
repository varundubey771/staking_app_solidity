const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function issueRewards(callback) {
  let decentralBank = await DecentralBank.deployed(); //take decentral bank contract
  await decentralBank.issueTokens();
  console.log("issued tokens");
  callback();
};
