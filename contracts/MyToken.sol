// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// 功能点：
// totalSupply -> 返回总供应量 =》自动更新
// balanceOf(address) -> 查询地址余额 =》读取mapping
// transfer(address) -> 实现用户向他人转账 =》检查余额、减少发送者余额、增加接收者余额
// approve() / allowance() -> 授权别人可以代表我转账 => 使用嵌套映射
// transferFrom()-> 第三方调用，实现代付 => 检查授权额度和余额
// mint() -> 自定义函数，铸造代币 =》仅合约 deployer 可调用

contract MyToken {
    mapping(address => uint256) balances;

    mapping(address=> mapping(address => uint256)) _allowance;

    address public owner;

    string public tokenName;

    string public symbolName;

    uint8 public decimals;

    uint256 public totalSupply;

    error InsufficientBalance(uint256 available, uint256 required);
    error NotOwner();

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _tokenName, string memory _symbolName, uint8 _decimals) {
        tokenName = _tokenName;
        symbolName = _symbolName;
        decimals = _decimals;

        owner = msg.sender;
    }

    function balanceOf(address input) public view returns(uint256 ) {
        return balances[input];
    }

    function transfer(address target, uint256 amount) checkBalance(msg.sender, amount) public returns (bool) {
        balances[msg.sender] -= amount;
        balances[target] += amount;
        emit Transfer(msg.sender, target, amount);
        return true;

    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowance[_owner][_spender];
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    modifier checkBalance(address input, uint256 amount) {
        uint256 balance = balances[input];
        if (balance < amount) revert InsufficientBalance({
            available: balance,
            required: amount
        });
        _;
    }  

    function transferFrom(address from, address to, uint256 amount)  public returns (bool) {

        require(balances[from] >= amount, "Insufficient balance");
        require(_allowance[from][msg.sender] >= amount, "Not allowed");

        balances[from] -= amount;
        balances[to] += amount;
        _allowance[from][msg.sender] -= amount;

        emit Transfer(from, to, amount);
        return true;

    }

    function mint(address to, uint256 amount) checkOwner() public returns (bool){
        balances[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount); // ERC20 标准建议：铸币视为从 address(0) 转出
        return true;
    }

    modifier checkOwner() {
        if (msg.sender != owner) revert NotOwner();
    _;
    }

}
