// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Vesting.sol";

// | 功能编号 | 名称                         | 必须实现 | 说明                  |
// | ---- | -------------------------- | ---- | ------------------- |
// | F1   | constructor(address token) | ✅ 是  | 初始化工厂绑定 token 地址    |
// | F2   | createVesting(...)         | ✅ 是  | 创建 Vesting 并保存映射    |
// | F3   | allVestings\[]             | ✅ 是  | 记录所有部署过的合约          |
// | F4   | vestingsOf\[address]       | ✅ 是  | 记录某用户名下的 Vesting 实例 |
// | F5   | getAllVestings()           | ✅ 是  | 查询所有 Vesting 实例     |
// | F6   | getVestingsOf(user)        | ✅ 是  | 查询某用户名下所有实例         |
// | F7   | VestingCreated event       | ✅ 是  | 事件监听支持前端 UI 联动      |


contract VestingFactory is Ownable {
    IERC20  public token; // ERC20
    Vesting[] public allVestings;


    mapping(address => Vesting[]) public vestingsOf;
    
        // 所有出现过的用户（可选，便于查询和聚合）
    address[] public allUsers;

    event VestingCreated(
    address indexed creator,
    address indexed beneficiary,
    address vesting,
    uint256 amount,
    uint256 duration
);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = IERC20(_tokenAddress);
    }
    
    function createVesting(address _beneficiary, uint256 _totalAmount, uint256 _duration) public onlyOwner {
        Vesting vesting = new Vesting(_beneficiary, _totalAmount, _duration, address(token));

        vestingsOf[_beneficiary].push(vesting);
        
        allVestings.push(vesting);

               // F6: 可选记录用户地址
        if (vestingsOf[_beneficiary].length == 1) {
            allUsers.push(_beneficiary);
        }

        emit VestingCreated(msg.sender, _beneficiary, address(vesting), _totalAmount, _duration);
    }
    
    function getVestingAddressesOf(address user) public view returns (address[] memory) {
        Vesting[] storage list = vestingsOf[user];
        address[] memory res = new address[](list.length);
        for (uint i = 0; i < list.length; i++) {
            res[i] = address(list[i]);
        }
        return res;
    }

    function getAllVestingAddresses() public view returns (address[] memory) {
        address[] memory res = new address[](allVestings.length);
        for (uint i = 0; i < allVestings.length; i++) {
            res[i] = address(allVestings[i]);
        }
        return res;
    }

    function getAllVestingsLength() public view returns (uint256) {
        return allVestings.length;
    }

    function getVestingsOfLength(address user) public view returns (uint256) {
        return vestingsOf[user].length;
    }

    function getAllUsers() public view returns (address[] memory) {
        return allUsers;
    }

}
