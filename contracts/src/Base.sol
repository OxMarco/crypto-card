// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Base is Ownable {
    enum Action {
        UNDEFINED,
        DEPOSIT,
        SETTLE_DEPOSIT,
        WITHDRAW,
        SETTLE_WITHDRAWAL,
        CAPTURE
    }

    struct Message {
        address from;
        uint64 localChain;
        address user;
        address token;
        uint256 amount;
        Action action;
    }

    error Exception(string reason);
}
