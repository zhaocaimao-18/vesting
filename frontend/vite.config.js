import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),       // ✅ 支持 @ 作为 src 根路径
      '@abi': path.resolve(__dirname, '../artifacts/contracts')  // ✅ 导入 ABI
    },
  },
  server: {
    fs: {
      allow: ['..'], // ✅ 允许访问 Hardhat 项目目录
    },
  },
})
