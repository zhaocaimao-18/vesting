import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../contexts/WalletContext';

const AutoWalletConnector = () => {

    const {setSigner, setWalletAddress} = useWallet();

    useEffect(() => {
        const tryConnect = async () => {
            if (!window.ethereum) return;

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();

            if (accounts.length === 0) return; // ❌ 用户没授权过钱包，别动

            const signer = provider.getSigner();
            const address = await signer.getAddress();

            setSigner(signer);
            setWalletAddress(address);

            console.log("✅ Auto reconnected:", address);
        };
        tryConnect();
    }, []);

        return null;
    };
    export default AutoWalletConnector;