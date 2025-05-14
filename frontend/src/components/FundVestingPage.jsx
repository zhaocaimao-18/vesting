import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

import {TOKEN_ABI, TOKEN_ADDRESS } from "../utils/ABI"; // 你那段代码的路径




const FundVestingPage = () => {
    const {signer, walletAddress} = useWallet();


    const[vestingAddress, setVestingAddress] = useState('');
    const[fundAmount, setFundAmount] = useState('');
    const [txStatus, setTxStatus] = useState('');

//    constructor(address _beneficiary, uint256 _totalAmount, uint256 _duration, address _tokenAddress) {
    const handleFund  = async () => {
        if (!signer) return alert('请先连接钱包');
        try {
        const factory = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        const tx = await factory.transfer(
            vestingAddress,
            ethers.utils.parseUnits(fundAmount, 18)
        );
        setTxStatus("⏳ 正在转账中...");
        await tx.wait();
        setTxStatus("✅ 转账成功！");
        } catch (err) {
        console.error(err);
        setTxStatus('❌ 创建失败: ' + err.message);
        }
    };

    if (!signer) {
        return <p className="text-white p-6">⚠️ 请先连接钱包再创建 Vesting</p>;
    }

  return (
    <div className="bg-white text-black p-6 max-w-xl mx-auto rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Fund Vesting 合约</h2>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">Vesting 合约地址：</label>
        <input
          type="text"
          value={vestingAddress}
          onChange={e => setVestingAddress(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-gray-700">转账金额（Token 单位）：</label>
        <input
          type="text"
          value={fundAmount}
          onChange={e => setFundAmount(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="text-center">
        <button
          onClick={handleFund}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          转账 Token
        </button>
      </div>

      {txStatus && (
        <p className="mt-6 text-center text-blue-600">{txStatus}</p>
      )}
    </div>
  );
};

export default FundVestingPage;