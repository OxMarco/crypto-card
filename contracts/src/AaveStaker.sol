// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.19;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "./interfaces/IPool.sol";
import {IAToken} from "./interfaces/IAToken.sol";

contract AaveStaker {
    IPool public immutable aave;

    event SupplyToAave(address indexed token, uint256 amount);
    event WithdrawFromAave(address indexed token, uint256 amount);

    error ExternalException(string reason);

    constructor(address _aave) {
        aave = IPool(_aave);
    }

    function _supplyToAave(address _token, uint256 amount) internal {
        IERC20 token = IERC20(_token);
        if (token.allowance(address(this), address(aave)) == 0) {
            token.approve(address(aave), type(uint256).max);
        }

        aave.supply(_token, amount, address(this), 0);

        emit SupplyToAave(_token, amount);
    }

    function _withdrawFromAave(address token, uint256 amount, uint256 slippage) internal returns (uint256) {
        uint256 amountOut = aave.withdraw(token, amount, address(this));
        if (amountOut < amount * ((10_000 - slippage) / 10_000)) revert ExternalException("Slippage too high");

        emit WithdrawFromAave(token, amount);

        return amountOut;
    }

    function quoteAave(address _atoken, uint256 amount) external view returns (uint256, uint8) {
        IAToken atoken = IAToken(_atoken);
        uint256 currentExchangeRate = atoken.getExchangeRate();

        return (amount * currentExchangeRate, atoken.decimals());
    }
}
