import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { TOKEN_ABI, TOKEN_ADDRESS } from '../utils/ABI';
import vestingJson from '@abi/Vesting.sol/Vesting.json';


const ClaimVestingPage = () => {

  const { signer, walletAddress } = useWallet();

  const [vestingAddress, setVestingAddress] = useState('');
  const [txStatus, setTxStatus] = useState('');

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const handleClaim = async () => {
    if (!signer) return alert("请连接钱包");
    if (!vestingAddress) return alert("请输入 Vesting 合约地址");

    try {
      const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const vesting = new ethers.Contract(vestingAddress, vestingJson.abi, signer);

      // 1️⃣ 查询 Vesting 合约当前余额
      const balanceBefore = await token.balanceOf(vestingAddress);
      console.log("📊 Vesting 合约当前余额:", ethers.utils.formatUnits(balanceBefore, 18));
      setTxStatus(`⌛ 当前余额：${ethers.utils.formatUnits(balanceBefore, 18)} Token，等待 5 秒...`);

      // 2️⃣ 等待 5 秒
      await sleep(5000);

      // 3️⃣ 调用 claim()
      const tx = await vesting.claim();
      setTxStatus("⏳ 正在领取...");
      await tx.wait();

      // 4️⃣ 查询用户余额变化（可选）
      const userBalance = await token.balanceOf(walletAddress);
      console.log("✅ 用户当前余额:", ethers.utils.formatUnits(userBalance, 18));

      setTxStatus(`✅ 领取成功！用户当前余额：${ethers.utils.formatUnits(userBalance, 18)}`);

    } catch (err) {
      console.error(err);
      setTxStatus("❌ 领取失败: " + (err.reason || err.message));
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white text-black rounded shadow">
      <h2 className="text-xl font-bold mb-4">领取 Vesting Token</h2>
      <input
        type="text"
        placeholder="Vesting 合约地址"
        value={vestingAddress}
        onChange={e => setVestingAddress(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleClaim}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Claim
      </button>
      {txStatus && <p className="mt-4 text-green-600">{txStatus}</p>}
    </div>
  );
};

export default ClaimVestingPage;