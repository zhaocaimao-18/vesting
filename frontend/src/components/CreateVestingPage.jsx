// import React, { useState } from 'react';
// import { useWallet } from '../contexts/WalletContext';
// import { ethers } from 'ethers';
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"

// import {VESTING_FACTORY_ABI, VESTING_FACTORY_ADDRESS } from "../utils/ABI"; // 你那段代码的路径




// const CreateVestingPage = () => {
//     const {signer, walletAddress} = useWallet();

//     console.log("🧪 In CreateVestingPage signer:", signer);
//     console.log("🧪 In CreateVestingPage walletAddress:", walletAddress);

//     const[beneficiary, setBeneficiary] = useState('');
//     const[amount, setAmount] = useState('');
//     const[duration, setDuration] = useState('');
//     const [txStatus, setTxStatus] = useState('');

// //    constructor(address _beneficiary, uint256 _totalAmount, uint256 _duration, address _tokenAddress) {
//     const handleCreate = async () => {
//         if (!signer) return alert('请先连接钱包');
//         try {
//         const factory = new ethers.Contract(VESTING_FACTORY_ADDRESS, VESTING_FACTORY_ABI, signer);
//         const tx = await factory.createVesting(beneficiary, ethers.utils.parseUnits(amount, 18), duration);
//         setTxStatus('⏳ 创建中...');
//         console.log(`STATUS IS ${txStatus}`)
//         const receipt = await tx.wait();


//         // 👇👇👇 这部分是你需要加的：解析 VestingCreated 事件
//         const iface = new ethers.utils.Interface(VESTING_FACTORY_ABI);

//         let vestingAddress = null;

//         for (const log of receipt.logs) {
//         try {
//             const parsed = iface.parseLog(log);
//             if (parsed.name === 'VestingCreated') {
//             vestingAddress = parsed.args.vesting;
//             console.log("📦 新 Vesting 地址:", vestingAddress);
//             console.log("💰 总金额:", ethers.utils.formatUnits(parsed.args.totalAmount, 18));
//             console.log("⏳ 持续时间:", parsed.args.duration.toString());
//             break;
//             }
//         } catch (err) {
//             // 有些日志可能不是 factory 的，直接跳过
//         }
//         }

//         if (!vestingAddress) {
//         setTxStatus("❌ 创建失败：未解析出 Vesting 地址");
//         return;
//         }

//         setTxStatus(`✅ 创建成功！Vesting 地址：${vestingAddress}`);
//         console.log(`STATUS IS ${txStatus}`)


//         } catch (err) {
//         console.error(err);
//         setTxStatus('❌ 创建失败: ' + err.message);
//         }
//     };

//     if (!signer) {
//         return <p className="text-white p-6">⚠️ 请先连接钱包再创建 Vesting</p>;
//     }

//   return (
//     <div className="bg-white text-black p-6 max-w-xl mx-auto rounded shadow">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">创建 Vesting 合约</h2>

//       {/* 受益人地址输入 */}
//       <div className="mb-4">
//         <Label className="block mb-1 text-gray-700">受益人地址：</Label>
//         <Input
//           type="text"
//           value={beneficiary}
//           onChange={e => setBeneficiary(e.target.value)}
//           className="w-full p-2 rounded border border-gray-300"
//         />
//       </div>

//       {/* Token 数量输入 */}
//       <div className="mb-4">
//         <Label className="block mb-1 text-gray-700">总金额（Token 单位）：</Label>
//         <Input
//           type="text"
//           value={amount}
//           onChange={e => setAmount(e.target.value)}
//           className="w-full p-2 rounded border border-gray-300"
//         />
//       </div>

//       {/* 持续时间输入 */}
//       <div className="mb-6">
//         <Label className="block mb-1 text-gray-700">持续时间（秒）：</Label>
//         <Input
//           type="text"
//           value={duration}
//           onChange={e => setDuration(e.target.value)}
//           className="w-full p-2 rounded border border-gray-300"
//         />
//       </div>

//       {/* 创建按钮 */}
//       <div className="text-center">
//         <Button
//           onClick={handleCreate}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
//         >
//           创建 Vesting
//         </Button>
//       </div>

//       {/* 交易状态提示 */}
//       {txStatus && (
//         <p className="mt-6 text-center text-green-600">{txStatus}</p>
//       )}
//     </div>
//   );
// };


// export default CreateVestingPage;
import React, { useState } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { ethers } from 'ethers'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { VESTING_FACTORY_ABI, VESTING_FACTORY_ADDRESS } from '../utils/ABI'

export default function CreateVestingPage() {
  const { signer, walletAddress } = useWallet()
  const [beneficiary, setBeneficiary] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')
  const [txStatus, setTxStatus] = useState('')

  const handleCreate = async () => {
    if (!signer) return alert('请先连接钱包')
    try {
      const factory = new ethers.Contract(VESTING_FACTORY_ADDRESS, VESTING_FACTORY_ABI, signer)
      const tx = await factory.createVesting(
        beneficiary,
        ethers.utils.parseUnits(amount, 18),
        duration
      )
      setTxStatus('⏳ 创建中...')
      const receipt = await tx.wait()

      const iface = new ethers.utils.Interface(VESTING_FACTORY_ABI)
      let vestingAddress = null
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log)
          if (parsed.name === 'VestingCreated') {
            vestingAddress = parsed.args.vesting
            console.log("📦 新 Vesting 地址:", vestingAddress)
            break
          }
        } catch (err) {}
      }

      if (!vestingAddress) {
        setTxStatus("❌ 创建失败：未解析出 Vesting 地址")
        return
      }

      setTxStatus(`✅ 创建成功！Vesting 地址：${vestingAddress}`)
    } catch (err) {
      console.error(err)
      setTxStatus('❌ 创建失败: ' + err.message)
    }
  }

  if (!signer) {
    return <p className="text-white p-6">⚠️ 请先连接钱包再创建 Vesting</p>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-xl">
        <CardContent>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">创建 Vesting 合约</h2>

          <div className="mb-4">
            <Label>受益人地址</Label>
            <Input value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
          </div>

          <div className="mb-4">
            <Label>总金额（Token 单位）</Label>
            <Input value={amount} onChange={e => setAmount(e.target.value)} />
          </div>

          <div className="mb-6">
            <Label>持续时间（秒）</Label>
            <Input value={duration} onChange={e => setDuration(e.target.value)} />
          </div>

          <div className="text-center">
            <Button onClick={handleCreate}>创建 Vesting</Button>
          </div>

          {txStatus && (
            <p className="mt-6 text-center text-green-600 whitespace-pre-line">{txStatus}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
