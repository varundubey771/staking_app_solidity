const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");
const Zen = artifacts.require("Zen");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentralBank", (accounts) => {
  function tokens(number) {
    return web3.utils.toWei(number, "ether");
  }
  before(async () => {
    tether = await Tether.new();
    zen = await Zen.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(
      rwd.address,
      tether.address,
      zen.address
    );

    await rwd.transfer(decentralBank.address, tokens("1000000"));

    await tether.transfer(accounts[1], tokens("100"), { from: accounts[0] });
  });

  describe("Tether deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });
  describe("rwd dep", async () => {
    it("matches the name", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward token");
    });
  });
  describe("Zen dep", async () => {
    it("matches symbol", async () => {
      const symbol = await zen.symbol();
      assert.equal(symbol, "zennn");
    });
  });
  describe("decentral bank dep", async () => {
    it("matches bank name", async () => {
      const name = await decentralBank.name();
      assert.equal(name, "Decentral Bank");
    });

    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentralBank.address);

      assert.equal(balance, "1000000000000000000000000");
    });
  });
  describe("yield farming", async () => {
    it("rewards tokens for staking", async () => {
      let result;
      result = await tether.balanceOf(accounts[1]);
      assert.equal(result.toString(), tokens("100"));

      await tether.approve(decentralBank.address, tokens("100"), {
        from: accounts[1],
      });
      await decentralBank.depositTokens(tokens("100"), { from: accounts[1] });

      bal = await tether.balanceOf(decentralBank.address);
      assert.equal(bal.toString(), tokens("100"), "passed0");
      isstake = await decentralBank.isStaked(accounts[1]);

      assert.equal(isstake.toString(), "true", "passed");
      await decentralBank.issueTokens({ from: accounts[0] });
      res = await rwd.balanceOf(accounts[1]);
      assert.equal(res.toString(), tokens("100"));
      await decentralBank.unstakeTokens({ from: accounts[1] });

      k = await tether.balanceOf(accounts[1]);
      assert.equal(k.toString(), tokens("100"));
    });
  });
});
