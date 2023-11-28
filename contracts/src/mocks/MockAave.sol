// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IPool} from "../interfaces/IPool.sol";

contract MockAave is IPool {
    uint256 public slippage = 0;

    function setSlippage(uint256 _slippage) external {
        slippage = _slippage;
    }

    function deposit(address asset, uint256 amount, address, uint16) external override {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(address asset, uint256 amount, address to) external override returns (uint256) {
        IERC20(asset).transfer(to, amount); // - amount * slippage);

        return amount;
    }

    function supply(address asset, uint256 amount, address, uint16) external override {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
    }
}
