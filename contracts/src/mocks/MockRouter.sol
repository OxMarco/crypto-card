// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {Client} from "@chainlink-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {IAny2EVMMessageReceiver} from "@chainlink-ccip/src/v0.8/ccip/interfaces/IAny2EVMMessageReceiver.sol";

contract MockRouter is IRouterClient {
    uint256 public fee;
    bool public paused = false;

    function setFee(uint256 _fee) external {
        fee = _fee;
    }

    function togglePaused() external {
        paused = !paused;
    }

    function isChainSupported(uint64) external view override returns (bool) {
        return true;
    }

    function getSupportedTokens(uint64) external view override returns (address[] memory) {
        return new address[](0);
    }

    function getFee(uint64, Client.EVM2AnyMessage memory) external view override returns (uint256) {
        return fee;
    }

    function ccipSend(uint64, Client.EVM2AnyMessage memory message) external payable override returns (bytes32) {
        if (paused) return 0;

        require(msg.value >= fee, "Insufficient ethers to pay for gas fees");

        Client.Any2EVMMessage memory replyMessage = Client.Any2EVMMessage({
            messageId: bytes32(0),
            sourceChainSelector: 0,
            sender: abi.encode(address(this)),
            data: message.data,
            destTokenAmounts: new Client.EVMTokenAmount[](0)
        });

        address to = abi.decode(message.receiver, (address));
        IAny2EVMMessageReceiver(to).ccipReceive(replyMessage);

        return replyMessage.messageId;
    }
}
