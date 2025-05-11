// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Vesting {
    address public beneficiary; // 受益人地址
    IERC20  public token; // ERC20
    uint256 public totalAmount; // 总额度
    uint256 public start; //开始时间
    uint256 public duration; //释放持续时间
    uint256 public claimed; // 已领取

    event Claimed(address _beneficiary, uint256 amount);
    constructor(address _beneficiary, uint256 _totalAmount, uint256 _duration, address _tokenAddress) {
        beneficiary = _beneficiary;
        token = IERC20(_tokenAddress);       
        totalAmount = _totalAmount;
        start = block.timestamp;
        duration = _duration;
        claimed = 0;
    }


    function _vestedAmount() internal view  returns (uint256) {
        if (block.timestamp < start) {
            return 0;
        } else if (block.timestamp >= start + duration) {
            return totalAmount;
        } else {
            return (block.timestamp - start)  * totalAmount / duration;
        }
    }

    function claim() public returns (bool) {
        require(beneficiary == msg.sender, "no permission");
        uint256 unreleased = _vestedAmount() - claimed;
        require(token.balanceOf(address(this)) >= unreleased, "insufficient balance in contract");

        require(unreleased > 0, "nothing to claim");
        claimed += unreleased;
        token.transfer(beneficiary, unreleased);
        emit Claimed(beneficiary, unreleased);
        return true;
    }

    function getClaimableAmount() public view returns (uint256) {
        return _vestedAmount() - claimed;
    }
}
