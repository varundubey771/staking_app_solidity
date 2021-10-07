import React, { Component } from "react";
import tether from "../tether.png";

class Main extends React.Component {
  render() {
    return (
      <div id="content " className="mt-3">
        <table
          style={{ color: "black" }}
          className="table table-dark text-muted text-center table-responsive{-sm|-md|-lg|-xl}"
        >
          <thead>
            <tr>
              <th scope="col"> Staking Balance</th>

              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>USDT</td>

              <td>RWD</td>
            </tr>
            <tr>
              <td>{this.props.stakingBalance} USDT</td>
              <td>{this.props.rwdBalance} RWD</td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-3">
          <form
            className="mb-3 "
            onSubmit={(event) => {
              event.preventDefault();
              let amount = this.input.value.toString();
              amount = window.web3.utils.toWei(amount, "Ether");
              this.props.stakeTokens(amount);
            }}
          >
            <label className="float-left ml-2 ">
              {" "}
              <b>Staking Amount</b>
            </label>

            <span className="float-right mr-2">
              Balance: {window.web3.utils.fromWei(this.props.tethBal, "ether")}
            </span>
            <div className="input-group">
              <input
                className="mr-2"
                placeholder="0"
                required
                ref={(input) => {
                  this.input = input;
                }}
              ></input>
              <div className="input-group-open">
                <div className="input-group-open">
                  <img alt="tether" height="40" src={tether}></img>
                  &nbsp; USDT
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
              >
                deposit
              </button>
            </div>
          </form>
          <button
            onClick={(event) => {
              event.preventDefault(this.props.unstakeTokens());
            }}
            type="submit"
            className="btn btn-primary btn-lg btn-block"
          >
            withdraw
          </button>
          <div className="text-center" style={{ color: "blue" }}>
            AIRDROP
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
