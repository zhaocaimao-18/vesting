const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

/**
 * 在指定合约的事件日志中查找并断言特定事件是否存在
 * @param {object} receipt - 交易 receipt（来自 tx.wait()）
 * @param {string} contractName - 部署时的合约名（如 "MyToken"）
 * @param {string} eventName - 事件名（如 "Transfer"）
 * @param {string[]} indexedArgs - 按顺序给出的 indexed 参数（如 [from, to]）
 */
async function expectEventFromReceipt(receipt, contractName, eventName, indexedArgs = []) {
  const artifact = await deployments.getArtifact(contractName);
  const contractInterface = new ethers.Interface(artifact.abi);
  const topicHash = contractInterface.getEvent(eventName).topicHash;

  // Pad indexed 参数
  const paddedTopics = indexedArgs.map(addr => ethers.zeroPadValue(addr, 32));

  const matchedLog = receipt.logs.find(log =>
    log.topics[0] === topicHash &&
    paddedTopics.every((topic, i) => log.topics[i + 1] === topic) // 注意 offset
  );

  expect(matchedLog, `❌ Event "${eventName}" not found in ${contractName} logs`).to.not.be.undefined;
}

module.exports = {
  expectEventFromReceipt,
};
