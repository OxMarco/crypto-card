// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAToken {
    function getExchangeRate() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function decimals() external view returns (uint8);
}
