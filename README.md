# 💰 ERC20 线性释放（Vesting）合约开发实战模板
🚀 本项目是一个完整的 ERC20 + Vesting 实战模板，涵盖从零构建、部署、测试到上线的全流程，适合 Web3 初学者和开发者参考复用。

作为我第一阶段 Solidity 学习的阶段性成果，本项目围绕一个完整的线性释放合约（Vesting）展开，模拟现实中代币逐步解锁（如团队激励、顾问 token 分发）的典型应用场景。项目目标是从零实现以下核心能力：

- ✅ 编写自定义的 ERC20 Token 合约（不依赖 OpenZeppelin）
- ✅ 设计并实现 Vesting 合约，支持线性释放逻辑
- ✅ 使用 Factory 模式批量创建 Vesting 合约
- ✅ 编写完整的部署脚本和单元测试和集成测试网，确保逻辑正确性

本项目不依赖模板工程，而是从初始化 Hardhat 项目、编写合约、部署到测试脚本，一步步构建而成，目标是**构建一份结构清晰、逻辑严谨、可复用的 Web3 开发实践项目模板**。
## 目录
- [💰 ERC20 线性释放（Vesting）合约开发实战模板](#-erc20-线性释放vesting合约开发实战模板)
  - [目录](#目录)
  - [♻️ 0.如何复用本项目](#️-0如何复用本项目)
  - [🧠 1. 项目背景与目标](#-1-项目背景与目标)
    - [1.1 前期项目准备PreStep](#11-前期项目准备prestep)
  - [🧱 2. 合约设计与实现](#-2-合约设计与实现)
    - [2.1 MyToken 合约（自定义 ERC20 实现）](#21-mytoken-合约自定义-erc20-实现)
      - [设计目标](#设计目标)
      - [核心数据结构](#核心数据结构)
    - [2.2 Vesting 合约](#22-vesting-合约)
      - [构造函数参数说明](#构造函数参数说明)
      - [线性释放计算逻辑（按秒释放）](#线性释放计算逻辑按秒释放)
      - [`claim()` 方法细节解析](#claim-方法细节解析)
    - [2.3 VestingFactory 合约](#23-vestingfactory-合约)
  - [📦 3. 部署流程与脚本结构](#-3-部署流程与脚本结构)
  - [🧪 4. 测试设计与覆盖策略](#-4-测试设计与覆盖策略)
    - [4.1 运行](#41-运行)
    - [4.2 测试网](#42-测试网)
    - [🛠 未来改进方向](#-未来改进方向)


## ♻️ 0.如何复用本项目
  你可以 clone 本项目并快速替换以下模块：
  - `MyToken.sol`：改为你自己的代币逻辑
  - `Vesting.sol`：替换成按比例释放、解锁阈值等更复杂的逻辑
  - `factory/*.js`：根据部署合约不同扩展部署流程
  - `.env.enc`：换成你自己的测试网 RPC 与私钥

## 🧠 1. 项目背景与目标
- Token 分发为什么需要 Vesting以及 本项目要解决的问题是什么？
    在 Web3 项目中，常见的合作关系往往包含甲方（资方）与乙方（开发方或顾问）。甲方希望激励乙方持续为项目贡献价值，而不是“一次性拿钱走人”；乙方则担心努力工作后拿不到报酬。
    于是，Vesting（线性释放）机制就应运而生，它解决了以下几个核心问题：
    - ✅ 防止乙方提前跑路：资方通过将资金锁定在 Vesting 合约中，让乙方只能“随时间逐步领取”，防止一次性提取所有资金。
    - ✅ 防止资方赖账：合约写死释放逻辑，一旦部署，甲方无法随意更改或阻止释放，确保乙方权益。
    - ✅ 链上透明、可追踪：Vesting 合约在链上公开部署，资金余额和释放状态完全可验证，建立信任机制。
    - 📌 简化理解：Vesting 就像一个“区块链上的分期付款系统”，把信任变成代码，把承诺写入时间。
- 项目整体架构图 todo                     
### 1.1 前期项目准备PreStep
1. create project
   1. `mkdir vesting` 创建目录
   2. `npm init  -y `  构建 npm项目
   3. `npm install --save-dev hardhat` 在开发分支下载`hardhat`
   4. `npx hardhat` 标记项目为hardhat项目
      1. 确认下载`npm install --save-dev @nomicfoundation/hardhat-toolbox` 
   5. `git init` optional
2. check
   1. 输入`npx hardhat --version` 和 结构如下：
   2. ```shell
          vesting/
            ├── contracts/            # Your Solidity contracts (e.g., Lock.sol)
            ├── test/                 # JS-based test scripts
            ├── hardhat.config.js     # Core Hardhat config file
            ├── package.json          # npm dependency manager
            ├── .gitignore            # Common .git exclusions
            ├── node_modules/         # Installed packages
            ├── package-lock.json     # Exact dependency lock
    ```
## 🧱 2. 合约设计与实现
### 2.1 MyToken 合约（自定义 ERC20 实现）
#### 设计目标
`MyToken` 是本项目中用于测试 Vesting 功能的 ERC20 代币合约。我们不使用 OpenZeppelin 的标准库，而是从零手写 ERC20 的核心逻辑，旨在深入理解：
- ERC20 的账户余额管理原理
- 授权机制（approve / allowance / transferFrom）
- mint 铸造函数的权限控制
- Transfer / Approval 等标准事件的用途

#### 核心数据结构
```solidity
    mapping(address => uint256) balances;
    mapping(address=> mapping(address => uint256)) _allowance;
```
- balances：记录每个地址拥有的代币数量
- allowance：嵌套映射，记录「授权地址」可以从「被授权地址」转出多少代币
  
### 2.2 Vesting 合约
`Vesting`是本项目中用于提供线性释放也就是给乙方`claim()`的入口项目，这里会明确：
#### 构造函数参数说明
- beneficiary：收益人的地址，也就是乙方地址
- totalAmount：受益人的总收益
- duration：收益人的收益总周期
- tokenAddres：使用代币的地址
#### 线性释放计算逻辑（按秒释放）
```text
    if now <= start:
        vested = 0
    elif now >= start + duration:
        vested = totalAmount
    else:
        vested = (now - start) * totalAmount / duration
```
#### `claim()` 方法细节解析
1. 检测已经拿到了钱：claimed变量当中
2. 调用线性释放逻辑得到：_vestedAmount
3. `claim=vestedAmount - claimed`
### 2.3 VestingFactory 合约
- 为什么用 Factory 模式？
  - 因为vesting的受益人很多，并且收益人可能需要多个vesting合约的情况，如果单独部署vesting费时费力，不如通过工厂模式，简化步骤，减少错误
- `createVesting`核心方法，功能如下：
  - 创建`Vesting`合约
  - 添加到vestingsOf当中，以beneficiary为key，合约vestings当中
  - 发送`VestingCreated`事件

## 📦 3. 部署流程与脚本结构
- Hardhat 项目初始化流程
  - 初始化 Hardhat 项目：npx hardhat
    
  - 安装hardhat-deploy-ethers
    - `npm install --save-dev @nomicfoundation/hardhat-ethers ethers hardhat-deploy hardhat-deploy-ethers`
    - 在hardhat.config.js
       ```js 
        require("@nomicfoundation/hardhat-ethers");
        require("hardhat-deploy");
        require("hardhat-deploy-ethers");
        module.exports = {
          networks: {
            hardhat: {},
          },
          namedAccounts: {
            deployer: {
              default: 0,
            },
          },
          solidity: "0.8.20",
        };
       ```
    - 🔍 理解插件之间的关系
      | 插件名称                              | 功能                                                                                                                 |
      | --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
      | `ethers`                          | Ethers.js 原始库（链上交互）                                                                                                |
      | `@nomicfoundation/hardhat-ethers` | 让 Hardhat 支持 ethers.js                                                                                             |
      | `hardhat-deploy`                  | Hardhat 部署插件，提供结构化部署机制                                                                                             |
      | `hardhat-deploy-ethers`           | 将 `hardhat-deploy` 与 `ethers.js` 整合，让你在部署脚本中获得更丰富的 ethers API（比如 `getContract`, `getSigner`, `getNamedAccounts` 等） |

      
## 🧪 4. 测试设计与覆盖策略
### 4.1 运行 
运行所有测试：
```bash
npx hardhat test
```
运行单个文件：
```bash
npx hardhat test test/token.test.js
```
### 4.2 测试网
我们写合约最终都是要上链的，但：
- 本地部署不具备链的真实交互环境
- 主网部署太贵，也无法试错
因此，Sepolia 作为官方主推的测试链，非常适合开发阶段使用。
1. 注册一个钱包MetaMask
   1. 访问 Sepolia 水龙头获取测试 ETH：官方水龙头：https://sepoliafaucet.com/
   2. 明确钱包功能 私钥 公钥等
2. 注册一个 Alchemy 账号=》app下 得到测试网的api 如：`https://eth-sepolia.g.alchemy.com/v2/xxx`
3. 配置 Hardhat 支持 Sepolia
   1. 下载env-enc:`npm install --save-dev @chainlink/env-enc`
   2. `npx env-enc set-pw` 配置密码
   3. `npx env-enc set` 加密比如 `key:ALCHEMY_SEPOLIA_URL,value:https://eth-sepolia.g.alchemy.com/v2/xxx`
   4. hardhat.config.js 
       ```js
        require("@chainlink/env-enc").config()
        require("@nomicfoundation/hardhat-ethers");
        require("hardhat-deploy");
        require("hardhat-deploy-ethers");

        const { PRIVATE_KEY, ALCHEMY_SEPOLIA_URL } =  process.env

        module.exports = {
          solidity: "0.8.20",
          namedAccounts: {
            deployer: {
              default: 0,
              sepolia: 0,
            },
          },
          networks: {
            sepolia: {
              url: ALCHEMY_SEPOLIA_URL,
              accounts: [PRIVATE_KEY],
              chainId: 11155111,
              saveDeployments: true,
            },
          },
        };
      ```
4. 运行 `npx hardhat test test/token.test.js --network sepolia`
5. 总结：部署到测试网你需要准备的就3样东西
  1. 一个 EOA 钱包（比如 MetaMask）+ 测试 ETH
  2. 一个 RPC 提供者（比如 Alchemy）
  3. 一个部署脚本（Hardhat + hardhat-deploy）
6. 验证 Etherscan  todo
7. TODO
### 🛠 未来改进方向
    - [ ] 添加基于 MerkleProof 的批量领取功能
    - [ ] 支持 cliff period（悬崖期）与可配置释放周期
    - [ ] 引入 Chainlink Keepers 自动触发释放

