// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {PRBTest} from "@prb/test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {ERC20PresetMinterPauser} from "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import {Accountant} from "../src/Accountant.sol";
import {Vault} from "../src/Vault.sol";
import {MockRouter} from "../src/MockRouter.sol";

contract IntegrationTest is PRBTest, StdCheats {
    ERC20PresetMinterPauser public immutable token;
    MockRouter public immutable router;
    Accountant public immutable accountant;
    Vault public immutable vault1;
    Vault public immutable vault2;

    constructor() {
        token = new ERC20PresetMinterPauser("test", "TEST");
        router = new MockRouter();
        accountant = new Accountant(address(router));
        vault1 = new Vault(0, address(accountant), 0, address(router));
        vault2 = new Vault(0, address(accountant), 0, address(router));

        vault1.toggleTokenStatus(address(token));
        vault2.toggleTokenStatus(address(token));
    }

    function _deposit(Vault vault, uint256 amount) internal {
        token.mint(address(this), amount);
        token.approve(address(vault), amount);
        vault.deposit(address(token), amount);
    }

    function _withdraw(Vault vault, uint256 amount) internal {
        vm.warp(block.timestamp + 12 hours);
        vault.withdraw(address(token), amount);
    }

    function testCoolOffPeriod() public {
        router.togglePaused();

        uint256 amount = 1000;
        _deposit(vault1, amount);

        assertEq(token.balanceOf(address(vault1)), amount);

        vm.expectRevert();
        vault1.withdraw(address(token), amount);

        vm.expectRevert();
        vault1.forceWithdraw(address(token), amount);

        vm.warp(block.timestamp + 12 hours);
        vault1.forceWithdraw(address(token), amount);

        assertEq(token.balanceOf(address(vault1)), 0);
        assertEq(token.balanceOf(address(this)), amount);
    }

    function testDeposit() public {
        uint256 amount1 = 1000;
        uint256 amount2 = 2000;

        assertEq(accountant.balances(address(this), 0, address(token)), 0);

        _deposit(vault1, amount1);
        _deposit(vault2, amount2);

        assertEq(accountant.balances(address(this), 0, address(token)), amount1 + amount2);
    }

    function testWithdraw() public {
        uint256 amount = 1000;

        _deposit(vault1, amount);

        vm.expectRevert();
        _withdraw(vault1, amount + 1);

        _withdraw(vault1, amount);
    }

    function testDepositWithdraw() public {
        uint256 amount1 = 1000;
        uint256 amount2 = 2000;

        _deposit(vault1, amount1);
        _deposit(vault2, amount2);

        assertEq(accountant.checkBalance(address(this), address(token)), amount1 + amount2);

        _withdraw(vault1, amount1);
        _withdraw(vault2, amount2);

        assertEq(accountant.checkBalance(address(this), address(token)), 0);
    }

    function testDepositWithdrawWithFee() public {
        router.setFee(100);
        vm.deal(address(this), 1e18);

        bool success = false;
        (success,) = address(vault1).call{value: 1000}("");
        assertTrue(success);
        (success,) = address(vault2).call{value: 1000}("");
        assertTrue(success);
        (success,) = address(accountant).call{value: 1000}("");
        assertTrue(success);

        testDepositWithdraw();
    }
}
