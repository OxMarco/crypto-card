// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.19;

import {PRBTest} from "@prb/test/PRBTest.sol";
import {StdCheats} from "forge-std/StdCheats.sol";
import {ERC20PresetMinterPauser} from "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import {Accountant} from "../src/Accountant.sol";
import {Vault} from "../src/Vault.sol";
import {MockRouter} from "../src/mocks/MockRouter.sol";
import {MockAave} from "../src/mocks/MockAave.sol";

contract UnitTest is PRBTest, StdCheats {
    address public constant DEPLOYER = address(0x1);
    ERC20PresetMinterPauser public immutable token;
    MockAave public immutable aave;
    MockRouter public immutable router;
    Accountant public immutable accountant;
    Vault public immutable vault1;
    Vault public immutable vault2;

    constructor() {
        token = new ERC20PresetMinterPauser("test", "TEST");
        vm.deal(DEPLOYER, 1 ether);

        vm.startPrank(DEPLOYER);
        aave = new MockAave();
        router = new MockRouter();
        accountant = new Accountant(address(router));
        vault1 = new Vault(0, address(accountant), 0, address(router), address(aave));
        vault2 = new Vault(1, address(accountant), 0, address(router), address(aave));

        vault1.toggleTokenStatus(address(token));
        vault2.toggleTokenStatus(address(token));
        vm.stopPrank();
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

        assertEq(token.balanceOf(address(aave)), amount);

        vm.expectRevert();
        vault1.withdraw(address(token), amount);

        vm.expectRevert();
        vault1.forceWithdraw(address(token), amount);

        vm.warp(block.timestamp + 12 hours);
        vault1.forceWithdraw(address(token), amount);

        assertEq(token.balanceOf(address(vault1)), 0);
        assertEq(token.balanceOf(address(this)), amount);
    }

    function testDeposit(uint256 amount1, uint256 amount2) public {
        vm.assume(amount2 < type(uint256).max - amount1);

        assertEq(accountant.balances(address(this), 0, address(token)), 0);

        _deposit(vault1, amount1);
        _deposit(vault2, amount2);

        assertEq(accountant.balances(address(this), 0, address(token)), amount1);
        assertEq(accountant.balances(address(this), 1, address(token)), amount2);
        assertEq(accountant.checkBalance(address(this), address(token)), amount1 + amount2);
    }

    function testWithdraw(uint256 amount) public {
        _deposit(vault1, amount);

        vm.expectRevert();
        _withdraw(vault1, amount + 1);

        _withdraw(vault1, amount);
    }

    function testDepositWithdrawing(uint256 amount1, uint256 amount2) public {
        vm.assume(amount2 < type(uint256).max - amount1);

        assertEq(accountant.checkBalance(address(this), address(token)), 0);

        _deposit(vault1, amount1);
        assertEq(accountant.checkBalance(address(this), address(token)), amount1);
        _deposit(vault2, amount2);
        assertEq(accountant.checkBalance(address(this), address(token)), amount1 + amount2);

        _withdraw(vault1, amount1);
        assertEq(accountant.checkBalance(address(this), address(token)), amount2);
        assertEq(token.balanceOf(address(this)), amount1);
        _withdraw(vault2, amount2);
        assertEq(accountant.checkBalance(address(this), address(token)), 0);
        assertEq(token.balanceOf(address(this)), amount1 + amount2);
    }

    function testDepositWithdrawWithFee(uint256 amount1, uint256 amount2) public {
        vm.assume(amount2 < type(uint256).max - amount1);

        router.setFee(100);
        vm.deal(address(this), 1e18);

        bool success = false;
        (success,) = address(vault1).call{value: 1000}("");
        assertTrue(success);
        (success,) = address(vault2).call{value: 1000}("");
        assertTrue(success);
        (success,) = address(accountant).call{value: 1000}("");
        assertTrue(success);

        testDepositWithdrawing(amount1, amount2);
    }

    function testHold(uint256 amount1, uint256 amount2, uint256 amountOnHold) public {
        vm.assume(amount2 < type(uint256).max - amount1);
        vm.assume(amountOnHold <= amount1 + amount2);

        _deposit(vault1, amount1);
        _deposit(vault2, amount2);

        vm.startPrank(DEPLOYER);
        vm.expectRevert();
        accountant.acquireHold(address(this), address(token), amount1 + amount2 + 1);
        accountant.acquireHold(address(this), address(token), amountOnHold);
        vm.stopPrank();

        assertEq(accountant.checkBalance(address(this), address(token)), amount1 + amount2 - amountOnHold);

        if (amountOnHold > 0) {
            vm.expectRevert();
            _withdraw(vault1, amount1);

            vm.expectRevert();
            _withdraw(vault2, amount2);
        }

        vm.prank(DEPLOYER);
        accountant.releaseHold(address(this), address(token), amountOnHold);

        _withdraw(vault1, amount1);
        _withdraw(vault2, amount2);
    }

    function testCapture(uint256 amount, uint256 capture) public {
        vm.assume(amount < type(uint256).max - capture);
        vm.assume(capture <= amount);

        _deposit(vault1, amount);

        assertEq(token.balanceOf(DEPLOYER), 0);

        vm.startPrank(DEPLOYER);
        accountant.acquireHold(address(this), address(token), capture);
        address[] memory users = new address[](1);
        users[0] = address(this);
        bytes memory checkData = abi.encode(address(vault1), uint64(0), address(token), users);
        (bool execute, bytes memory data) = accountant.checkUpkeep(checkData);
        if (execute) {
            accountant.performUpkeep(data);
        }
        vm.stopPrank();

        assertEq(token.balanceOf(DEPLOYER), capture);
    }
}
