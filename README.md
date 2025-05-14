# 🪙 Token Vesting DApp
这是一个基于 Solidity、Hardhat、React 构建的线性释放（Vesting）合约项目，支持：

- ✅ 创建 Vesting 合约（Create）
- 💰 注资（Fund）
- 🎁 领取代币（Claim）

该项目完整实现了一个典型的 Web3 Vesting 流程，可用于团队激励、顾问代币发放等场景。

📘 查看设计文档：`/doc/vesting-design.md`

---

## 🔧 关于代币注资（Mint）

如果你希望将 ERC20 Token 预先转入某个 Vesting 合约地址，用于测试或初始化资金，可使用项目提供的脚本：

```bash
npx hardhat run scripts/mint-token.js --network sepolia
```
## 📦 项目结构
contracts/ # Solidity 合约（ERC20 + Vesting + Factory）
deploy/ # Hardhat-deploy 脚本
frontend/ # 前端代码（React + Tailwind + shadcn/ui）
hardhat.config.js # Hardhat 配置

## 🚀 快速启动
### ✅ 1. 安装依赖（根目录）
```bash
npm install
```
### ✅ 2. 配置 Chainlink / Sepolia 环境变量
使用 env-enc 工具对私钥、RPC URL 等敏感信息进行加密管理：

```bash
npx env-enc set-pw               # 设置加密密码
npx env-enc set                  # 配置环境变量，例如：
```
建议添加以下字段：

```ini
SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY1=0xabc123...
PRIVATE_KEY2=0xdef456...
```
### ✅ 3. 编译合约
```bash
npx hardhat compile
```
### ✅ 4. 部署合约到 Sepolia 测试网
```bash
npx hardhat deploy --network sepolia
```
部署成功后，Hardhat 会在 deployments/sepolia/ 下生成每个合约的 JSON 文件（包含地址与 ABI 信息）。

### 📦 请手动复制 ABI 到前端项目中：
```bash
cp deployments/sepolia/*.json frontend/src/contracts/
```
### ✅ 5. 启动前端应用
```bash
cd frontend
npm install
npm run dev
```
默认运行在 http://localhost:5173。

## 