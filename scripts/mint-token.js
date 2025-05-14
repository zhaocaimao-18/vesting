const {ethers} = require("hardhat");

async function main() {
  // 👇 替换为目标地址
  const recipient = "0x3Aa0240B359b191Eeb7DC3840Db7e9836fE36673";
  const mintAmount = "2400"; // token 数量（人类可读）

  // 获取部署的合约实例（确保已部署）
  const token = await ethers.getContract("MyToken");

  console.log(`Minting ${mintAmount} tokens to ${recipient}...`);

  const tx = await token.mint(recipient, ethers.parseUnits(mintAmount, 18));
  await tx.wait();

  console.log("✅ Mint 成功！");
}

main().catch((error) => {
  console.error("❌ 脚本执行失败:", error);
  process.exit(1);
});