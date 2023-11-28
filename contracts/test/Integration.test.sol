// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {PRBTest} from "@prb/test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Accountant} from "../src/Accountant.sol";
import {Vault} from "../src/Vault.sol";
import {MockRouter} from "../src/mocks/MockRouter.sol";

contract IntegrationTest is PRBTest, StdCheats {
    address public constant DEPLOYER = address(0x1);
    address public constant USER = address(0x2);
    address public constant AAVE = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;
    address public constant AAVE_USDC = 0x98C23E9d8f34FEFb1B7BD6a91B7FF122F4e16F5c;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    IERC20 public constant TOKEN = IERC20(USDC);
    address public constant WHALE = 0xcEe284F754E854890e311e3280b767F80797180d;
    MockRouter public immutable router;
    Accountant public immutable accountant;
    Vault public immutable vault;

    constructor() {
        vm.createSelectFork(vm.envString("FORK_URL"), 18_543_567);

        vm.deal(DEPLOYER, 1 ether);
        vm.deal(USER, 1 ether);

        vm.startPrank(DEPLOYER);
        router = new MockRouter();
        accountant = new Accountant(address(router));
        vault = new Vault(0, address(accountant), 0, address(router), AAVE);
        vault.toggleTokenStatus(USDC);
        vm.stopPrank();
    }

    function _deposit(uint256 amount) internal {
        vm.prank(WHALE);
        TOKEN.transfer(USER, amount);

        vm.startPrank(USER);
        TOKEN.approve(address(vault), amount);
        vault.deposit(address(USDC), amount);
        vm.stopPrank();
    }

    function _withdraw(uint256 amount) internal {
        vm.warp(block.timestamp + 12 hours);

        vm.prank(USER);
        vault.withdraw(address(USDC), amount);
    }

    function testAllocation(uint256 amount) public {
        vm.assume(amount > 1);
        vm.assume(amount < TOKEN.balanceOf(WHALE));

        uint256 initialAaveBalance = TOKEN.balanceOf(AAVE_USDC);
        _deposit(amount);
        assertEq(vault.freeLiquidity(USDC), 0);
        assertEq(accountant.checkBalance(USER, USDC), amount);
        assertEq(TOKEN.balanceOf(AAVE_USDC), initialAaveBalance + amount);

        vm.expectRevert();
        _withdraw(amount + 1);

        _withdraw(amount);
        assertEq(vault.freeLiquidity(USDC), 0);
        assertEq(accountant.checkBalance(USER, USDC), 0);
        assertEq(IERC20(USDC).balanceOf(address(vault)), 0);
        assertEq(TOKEN.balanceOf(AAVE_USDC), initialAaveBalance);
    }
}
