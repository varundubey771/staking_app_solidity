import React, { Component } from "react";

import Navbar from "./Navbar";

import "./App.css";

import Web3 from "web3";

import Tether from "../truffle_abis/Tether.json";

import RWD from "../truffle_abis/RWD.json";
import DecentralBank from "../truffle_abis/DecentralBank.json";
import Main from "./Main";

class App extends React.Component {
  async UNSAFE_componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("no eth browser detected");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    this.setState({ account: account[0] });
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    //load tether contract
    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      this.setState({ tether });
      let tetherBalance = await tether.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tetherBalance: tetherBalance.toString() });
      console.log(this.state.account);
      console.log(tetherBalance);
    } else {
      window.alert("error tether contract not deployed");
    }

    //lload reward
    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      this.setState({ rwd });
      let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
      this.setState({ rwdBalance: rwdBalance.toString() });
      console.log(rwdBalance);
    } else {
      window.alert("rwd contrcat didnt load");
    }
    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address
      );
      this.setState({ decentralBank });
      let stakingBalance = await decentralBank.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      console.log(stakingBalance);
    } else {
      window.alert("decentralbank didnt load");
    }

    this.setState({ loading: false });
  }

  constructor(props) {
    super(props);

    this.state = {
      account: "oxo",
      decentralBank: {},
      tether: {},
      rwd: {},
      zen: {},
      tetherBalance: 0,
      rwdBalance: 0,
      zenBalance: 0,
      stakingBalance: 0,
      loading: true,
    };
  }
  unstakeTokens = () => {
    this.setState({ loading: true });
    this.state.decentralBank.methods
      .unstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  stakeTokens = (amount) => {
    this.setState({ loading: true });
    this.state.tether.methods
      .approve(this.state.decentralBank._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.decentralBank.methods
          .depositTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  render() {
    let content;
    {
      this.state.loading
        ? (content = <p>LOADING....</p>)
        : (content = (
            <Main
              tethBal={this.state.tetherBalance}
              rwdBalance={this.state.rwdBalance}
              stakingBalance={window.web3.utils.fromWei(
                this.state.stakingBalance
              )}
              stakeTokens={this.stakeTokens}
              unstakeTokens={this.unstakeTokens}
            ></Main>
          ));
    }
    return (
      <div>
        <Navbar account={this.state.account}></Navbar>

        <div className="container-fluid mt-5">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px", minHeight: "100vm" }}
          >
            <div>{content}</div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;

//html is markup language for writing website
//css is for styling website
//js allows website to be dynamic
