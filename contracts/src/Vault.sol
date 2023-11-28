// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {IERC20, SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {CCIPReceiver} from "@chainlink-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {AaveStaker} from "./AaveStaker.sol";
import {Base} from "./Base.sol";

contract Vault is AaveStaker, CCIPReceiver, Base {
    using SafeERC20 for IERC20;

    uint64 public immutable localChain;
    uint64 public immutable accountantChain;
    IRouterClient public immutable router;
    bytes public accountant;
    mapping(address user => mapping(address token => uint256 balance)) public unaccountedBalances;
    mapping(address user => uint256 timestamp) public lastOperation;
    mapping(address token => bool status) public supportedTokens;
    mapping(address token => uint256 unallocated) public freeLiquidity;

    event MessageSent(bytes32 indexed messageId);
    event UnconfirmedDeposit(address indexed user, address indexed token, uint256 amount);
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdrawal(address indexed user, address indexed token, uint256 amount);
    event Capture(address indexed token, uint256 amount);
    event ForcedWithdrawal(address indexed user, address indexed token, uint256 amount);
    event TokenStatusUpdate(address indexed token, bool status);

    constructor(uint64 _localChain, address _accountant, uint64 _accountantChain, address _router, address _aave)
        AaveStaker(_aave)
        CCIPReceiver(_router)
    {
        localChain = _localChain;
        accountant = abi.encode(_accountant);
        accountantChain = _accountantChain;
        router = IRouterClient(_router);
    }

    receive() external payable {}

    modifier coolOff(address user) {
        if (block.timestamp - lastOperation[user] < 12 hours) revert Exception("Cool off period");
        _;
    }

    modifier supportedToken(address token) {
        if (!supportedTokens[token]) revert Exception("Unsupported token");
        _;
    }

    function toggleTokenStatus(address token) external onlyOwner {
        supportedTokens[token] = !supportedTokens[token];

        emit TokenStatusUpdate(token, supportedTokens[token]);
    }

    function sweep(uint256 amount) external onlyOwner {
        (bool success,) = owner().call{value: amount}("");
        if (!success) revert Exception("Failed to withdraw");
    }

    function deallocate(address token, uint256 amount) external onlyOwner {
        _deallocate(token, amount);
    }

    function deposit(address token, uint256 amount) external supportedToken(token) {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        unaccountedBalances[msg.sender][token] += amount;

        _supplyToAave(token, amount);

        Message memory message = Message({
            from: address(this),
            localChain: localChain,
            user: msg.sender,
            token: token,
            amount: amount,
            action: Action.DEPOSIT
        });
        bytes memory data = abi.encode(message);
        _ccipSend(data);

        emit UnconfirmedDeposit(msg.sender, token, amount);
    }

    function _processDeposit(address user, address token, uint256 amount) internal {
        unaccountedBalances[user][token] -= amount;

        emit Deposit(user, token, amount);
    }

    function withdraw(address token, uint256 amount) external coolOff(msg.sender) {
        if (freeLiquidity[token] < amount) {
            _deallocate(token, amount);
        }

        Message memory message = Message({
            from: address(this),
            localChain: localChain,
            user: msg.sender,
            token: token,
            amount: amount,
            action: Action.WITHDRAW
        });
        bytes memory data = abi.encode(message);
        _ccipSend(data);
    }

    function _processWithdrawal(address user, address token, uint256 amount) internal {
        IERC20(token).safeTransfer(user, amount);
        freeLiquidity[token] -= amount;

        emit Withdrawal(user, token, amount);
    }

    function forceWithdraw(address token, uint256 amount) external coolOff(msg.sender) {
        if (unaccountedBalances[msg.sender][token] < amount) revert Exception("Insufficient balance");
        if (freeLiquidity[token] < amount) {
            _deallocate(token, amount);
        } else {
            freeLiquidity[token] -= amount;
        }

        unaccountedBalances[msg.sender][token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit ForcedWithdrawal(msg.sender, token, amount);
    }

    function _processCapture(address token, uint256 amount) internal {
        // @todo this should not be in a callback
        if (freeLiquidity[token] < amount) {
            _deallocate(token, amount);
        } else {
            freeLiquidity[token] -= amount;
        }
        IERC20(token).safeTransfer(owner(), amount);

        emit Capture(token, amount);
    }

    function _deallocate(address token, uint256 amount) internal {
        freeLiquidity[token] += _withdrawFromAave(token, amount, 100);
    }

    function _ccipSend(bytes memory data) internal {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: accountant,
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });
        uint256 fee = router.getFee(accountantChain, message);
        bytes32 messageId = router.ccipSend{value: fee}(accountantChain, message);

        emit MessageSent(messageId);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        (Message memory receivedMessage) = abi.decode(message.data, (Message));
        if (receivedMessage.action == Action.SETTLE_DEPOSIT) {
            _processDeposit(receivedMessage.user, receivedMessage.token, receivedMessage.amount);
        } else if (receivedMessage.action == Action.SETTLE_WITHDRAWAL) {
            _processWithdrawal(receivedMessage.user, receivedMessage.token, receivedMessage.amount);
        } else if (receivedMessage.action == Action.CAPTURE) {
            _processCapture(receivedMessage.token, receivedMessage.amount);
        } else {
            revert Exception("Invalid action");
        }
    }
}
