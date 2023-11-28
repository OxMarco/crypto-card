// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Base} from "./Base.sol";
import {console2} from "forge-std/console2.sol";

contract Accountant is CCIPReceiver, Base {
    IRouterClient public immutable router;
    mapping(address user => uint64[] chains) public activeChainIds;
    mapping(address user => mapping(uint64 chainId => mapping(address token => uint256 balance))) public balances;
    mapping(address user => mapping(address token => uint256 balances)) public holds;

    event MessageSent(bytes32 indexed messageId);

    constructor(address _router) CCIPReceiver(_router) {
        router = IRouterClient(_router);
    }

    receive() external payable {}

    function checkBalance(address user, address token) public view returns (uint256) {
        uint256 balance = 0;
        for (uint8 i = 0; i < activeChainIds[user].length; i++) {
            uint64 chainId = activeChainIds[user][i];
            balance += balances[user][chainId][token];
        }
        balance -= holds[user][token];
        return balance;
    }

    function acquireHold(address user, address token, uint256 amount) external onlyOwner {
        if (checkBalance(user, token) < amount) {
            revert Exception("Insufficient balance");
        }
        holds[user][token] += amount;
    }

    function releaseHold(address user, address token, uint256 amount) external onlyOwner {
        require(holds[user][token] >= amount, "Insufficient balance on hold");
        holds[user][token] -= amount;
    }

    function capture(address vault, uint64 chain, address token, address[] memory users, uint256[] memory amounts)
        external
        onlyOwner
    {
        assert(users.length == amounts.length);

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < users.length; i++) {
            if (holds[users[i]][token] < amounts[i]) revert Exception("Insufficient balance on hold");
            if (balances[users[i]][chain][token] < amounts[i]) revert Exception("Insufficient balance");
            holds[users[i]][token] -= amounts[i];
            balances[users[i]][chain][token] -= amounts[i];
            totalAmount += amounts[i];
        }

        Message memory message = Message({
            from: address(this),
            localChain: chain,
            user: address(0),
            token: token,
            amount: totalAmount,
            action: Action.CAPTURE
        });
        bytes memory data = abi.encode(message);
        _ccipSend(vault, chain, data);
    }

    function _chainRegistered(address user, uint64 chain) internal view returns (bool) {
        for (uint8 i = 0; i < activeChainIds[user].length; i++) {
            uint64 chainId = activeChainIds[user][i];
            if (chain == chainId) {
                return true;
            }
        }

        return false;
    }

    function _acknowledgeDeposit(address vault, address user, uint64 chain, address token, uint256 amount) internal {
        balances[user][chain][token] += amount;

        if (!_chainRegistered(user, chain)) activeChainIds[user].push(chain);

        Message memory message = Message({
            from: address(this),
            localChain: chain,
            user: user,
            token: token,
            amount: amount,
            action: Action.SETTLE_DEPOSIT
        });
        bytes memory data = abi.encode(message);
        _ccipSend(vault, chain, data);
    }

    function _acknowledgeWithdrawal(address vault, address user, uint64 chain, address token, uint256 amount)
        internal
    {
        console2.log("balance", balances[user][chain][token]);
        console2.log("holds", holds[user][token]);
        console2.log("amount", amount);

        if (balances[user][chain][token] < holds[user][token] + amount) revert Exception("Insufficient free balance");
        balances[user][chain][token] -= amount;

        Message memory message = Message({
            from: address(this),
            localChain: chain,
            user: user,
            token: token,
            amount: amount,
            action: Action.SETTLE_WITHDRAWAL
        });
        bytes memory data = abi.encode(message);
        _ccipSend(vault, chain, data);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (Message memory receivedMessage) = abi.decode(message.data, (Message));
        if (receivedMessage.action == Action.DEPOSIT) {
            _acknowledgeDeposit(
                receivedMessage.from,
                receivedMessage.user,
                receivedMessage.localChain,
                receivedMessage.token,
                receivedMessage.amount
            );
        } else if (receivedMessage.action == Action.WITHDRAW) {
            _acknowledgeWithdrawal(
                receivedMessage.from,
                receivedMessage.user,
                receivedMessage.localChain,
                receivedMessage.token,
                receivedMessage.amount
            );
        } else {
            revert Exception("Invalid action");
        }
    }

    function _ccipSend(address to, uint64 chain, bytes memory data) internal {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(to),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });
        uint256 fee = router.getFee(chain, message);
        bytes32 messageId = router.ccipSend{value: fee}(chain, message);

        emit MessageSent(messageId);
    }
}
