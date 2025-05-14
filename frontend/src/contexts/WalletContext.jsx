// src/contexts/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);


        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const currentSigner = await provider.getSigner();
          const address = await currentSigner.getAddress();
          setSigner(currentSigner);
          setWalletAddress(address);
          console.log("🔗 检测到已有连接账户:", address);
        }
      }
    };

    checkWallet();

    // 监听账户切换
    window.ethereum?.on('accountsChanged', async (accounts) => {
      if (accounts.length > 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // ✅ v5 写法
        const newSigner = await provider.getSigner();
        const address = await newSigner.getAddress();
        setSigner(newSigner);
        setWalletAddress(address);
        console.log("🔄 已切换账户:", address);
      } else {
        // 用户断开连接
        setSigner(null);
        setWalletAddress('');
        console.log("⚠️ 钱包断开连接");
      }
    });

    // 监听链切换（可选）
    window.ethereum?.on('chainChanged', () => {
      window.location.reload();
    });

    return () => {
      window.ethereum?.removeAllListeners('accountsChanged');
      window.ethereum?.removeAllListeners('chainChanged');
    };
  }, []);

  return (
    <WalletContext.Provider value={{ signer, setSigner, walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
