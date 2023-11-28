// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {CCIPReceiver} from "@chainlink-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {AutomationCompatible} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {Base} from "./Base.sol";

contract Accountant is AutomationCompatible, CCIPReceiver, Base {
    IRouterClient public immutable router;
    mapping(address user => uint64[] chains) public activeChainIds;
    mapping(address user => mapping(uint64 chainId => mapping(address token => uint256 balance))) public balances;
    mapping(address user => mapping(address token => uint256 capture)) public holds;
    mapping(address token => uint256 threshold) public captureThresholds;

    event MessageSent(bytes32 indexed messageId);
    event HoldAcquired(address indexed user, address indexed token, uint256 amount);
    event HoldRenewed(address indexed user, address indexed token, uint256 amount);
    event HoldReleased(address indexed user, address indexed token, uint256 amount);
    event DepositAccounted(address indexed user, uint64 indexed chain, address indexed token, uint256 amount);
    event WithdrawalAccounted(address indexed user, uint64 indexed chain, address indexed token, uint256 amount);
    event Captured(uint64 indexed chain, address indexed token, uint256 amount);
    event CaptureThresholdUpdated(address indexed token, uint256 threshold);

    constructor(address _router) CCIPReceiver(_router) {
        router = IRouterClient(_router);
    }

    receive() external payable {}

    function updateCaptureThreshold(address token, uint256 threshold) external onlyOwner {
        captureThresholds[token] = threshold;

        emit CaptureThresholdUpdated(token, threshold);
    }

    function acquireHold(address user, address token, uint256 amount) external onlyOwner {
        if (checkBalance(user, token) < amount) revert Exception("Insufficient balance");
        holds[user][token] += amount;

        emit HoldAcquired(user, token, amount);
    }

    function releaseHold(address user, address token, uint256 amount) external onlyOwner {
        if (holds[user][token] < amount) revert Exception("Insufficient balance on hold");
        holds[user][token] -= amount;

        emit HoldReleased(user, token, amount);
    }

    function checkBalance(address user, address token) public view returns (uint256) {
        uint256 balance = 0;
        for (uint8 i = 0; i < activeChainIds[user].length; i++) {
            uint64 chainId = activeChainIds[user][i];
            balance += balances[user][chainId][token];
        }
        balance -= holds[user][token];
        return balance;
    }

    function checkUpkeep(bytes calldata checkData) external view override returns (bool, bytes memory) {
        (address vault, uint64 chain, address token, address[] memory users) =
            abi.decode(checkData, (address, uint64, address, address[]));

        bool upkeepNeeded = false;
        uint256 index = 0;
        uint256 usersLength = users.length;
        address[] memory usersToUpdate = new address[](usersLength);
        uint256 totalAmount = 0;

        for (uint256 i = 0; i < usersLength; i++) {
            uint256 holdAmount = holds[users[i]][token];
            uint256 balanceAmount = balances[users[i]][chain][token];

            if (holdAmount == 0 || balanceAmount == 0) continue;

            if (balanceAmount < holdAmount) {
                totalAmount += balanceAmount;
            } else {
                totalAmount += holdAmount;
            }

            usersToUpdate[index] = users[i];
            index++;
        }

        if (totalAmount >= captureThresholds[token]) upkeepNeeded = true;

        return (upkeepNeeded, abi.encode(vault, chain, token, usersToUpdate));
    }

    function performUpkeep(bytes calldata performData) external override {
        (address vault, uint64 chain, address token, address[] memory users) =
            abi.decode(performData, (address, uint64, address, address[]));
        _capture(vault, chain, token, users);
    }

    function _capture(address vault, uint64 chain, address token, address[] memory users) internal {
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < users.length; i++) {
            uint256 holdAmount = holds[users[i]][token];
            uint256 balanceAmount = balances[users[i]][chain][token];

            if (holdAmount == 0 || balanceAmount == 0) continue;

            if (balanceAmount < holdAmount) {
                holds[users[i]][token] -= balanceAmount;
                balances[users[i]][chain][token] = 0;
                totalAmount += balanceAmount;
            } else {
                balances[users[i]][chain][token] -= holdAmount;
                holds[users[i]][token] = 0;
                totalAmount += holdAmount;
            }
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

        emit Captured(chain, token, totalAmount);
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

        emit DepositAccounted(user, chain, token, amount);
    }

    function _acknowledgeWithdrawal(address vault, address user, uint64 chain, address token, uint256 amount)
        internal
    {
        if (balances[user][chain][token] < holds[user][token] + amount) {
            revert Exception("Insufficient free balance");
        }
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

        emit WithdrawalAccounted(user, chain, token, amount);
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
