// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"


const HomePage = () => {
  const { signer, walletAddress, setSigner, setWalletAddress } = useWallet();
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install Metamask.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const newSigner = provider.getSigner();
      const address = await newSigner.getAddress();

      setSigner(newSigner);
      setWalletAddress(address);

      console.log("✅ Wallet connected:", address);
    } catch (error) {
      console.error("❌ Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    // 自动连接已有授权账户（比如刷新页面）
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.listAccounts().then(async (accounts) => {
        if (accounts.length > 0) {
          const newSigner = provider.getSigner();
          const address = await newSigner.getAddress();
          setSigner(newSigner);
          setWalletAddress(address);
          console.log("🔁 自动恢复连接:", address);
        }
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-6 flex flex-col gap-4">
          {!signer ? (
            <>
              <h2 className="text-xl font-semibold text-center">🔐 请连接钱包</h2>
              <Button onClick={connectWallet}>连接钱包</Button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-center">
                👛 当前地址：
                <span className="break-all text-sm font-mono text-zinc-700">
                  {walletAddress}
                </span>
              </h2>
              <Button onClick={() => navigate("/create")}>创建 Vesting 合约</Button>
              <Button onClick={() => navigate("/fund")} variant="secondary">
                打入 Token（Fund）
              </Button>
              <Button onClick={() => navigate("/claim")} variant="outline">
                领取 Token（Claim）
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
