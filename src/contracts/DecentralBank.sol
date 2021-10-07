pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";
import "./Zen.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;
    Zen public zen;
    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(
        RWD _rwd,
        Tether _tether,
        Zen _zen
    ) public {
        rwd = _rwd;
        tether = _tether;
        zen = _zen;
        owner = msg.sender;
    }

    //staking function
    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount cant be 0");

        //trasnfer tether tokens to this contract address for staking

        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner);
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) rwd.transfer(recipient, balance);
        }
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0);
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] -= balance;
        isStaked[msg.sender] = false;
    }
}
