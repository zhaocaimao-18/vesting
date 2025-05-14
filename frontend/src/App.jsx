import React from 'react';

import { WalletProvider } from './contexts/WalletContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './components/HomePage';
import CreateVestingPage from './components/CreateVestingPage';
import AutoWalletConnector from './components/AutoWalletConnector';
import ClaimVestingPage from './components/ClaimVestingPage';
import FundVestingPage from './components/FundVestingPage';

import 'tailwindcss/tailwind.css';

const App = () => {

  return (

    <WalletProvider>
      <AutoWalletConnector /> {/* ✅ 自动连接钱包 */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateVestingPage />} />
          <Route path="/fund" element={<FundVestingPage/>} />
          <Route path="/claim" element={<ClaimVestingPage/>}/>
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
};

export default App;
