# 🪙 Token Vesting DApp
这是一个基于 Solidity、Hardhat、React构建的线性释放（Vesting）合约项目，支持创建 Vesting 合约、注资（Fund）、领取代币（Claim）等完整流程。
## 📦 项目结构
contracts/ # Solidity 合约（ERC20 + Vesting + Factory）
deploy/ # Hardhat-deploy 脚本
frontend/ # 前端代码（React + Tailwind + shadcn/ui）
hardhat.config.js # Hardhat 配置
## 快速启动
1. 安装依赖：npm install
2. 配置 Chainlink / Sepolia 环境变量 加密私钥 以及 alchemy url等
   1. npx env-enc set-pw
   2. npx env-enc set 配置（SEPOLIA_URL， PRIVATE_KEY1， PRIVATE_KEY2等）
3. 编译合约 `npx hardhat compile`
4. 部署合约到 Sepolia 测试网 `npx hardhat deploy --network sepolia` 
   1. 将deployment下的 ABI信息拷贝到前端： `cp deployments/sepolia/*.json frontend/src/contracts/`
5. 前端启动
   1. cd frontend
   2. npm install
   3. npm run dev


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