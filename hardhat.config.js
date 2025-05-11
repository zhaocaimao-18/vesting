require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config()
require("hardhat-deploy");
require("hardhat-deploy-ethers");


const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY


module.exports = {
  solidity: "0.8.28",
  mocha: {
    timeout: 520000
  },
  
  namedAccounts: {
    first: {
      default: 0, 
    },
    second: {
      default: 1,
    }
  },

  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
      chainId: 11155111
    }
  },

  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },


};
