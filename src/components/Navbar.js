import React, { Component } from "react";
import bank from "../bank.png";

class Navbar extends React.Component {
  render() {
    return (
      <div>
        <nav
          className="navbar navbar-dark fixed-top shadow p-0 "
          style={{ backgroundColor: "black" }}
        >
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            style={{ color: "white" }}
          >
            Dapp yield staking
          </a>
          <ul>
            <li>
              <small className="mr-3" style={{ color: "white" }}>
                acc numb {this.props.account}
              </small>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
