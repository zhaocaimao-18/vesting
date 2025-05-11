const {  DECIMAL,TOKEN_NAME,SYMBOL_TOKEN } = require("../helper.hardhat.config")



module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy } = deployments;
      const { first, second } = await getNamedAccounts();
    
      // address _beneficiary, uint256 _totalAmount, uint256 _duration, address _tokenAddress
      const amount = ethers.parseUnits("1000", 18);
      const duration = 60;
      const token = await deployments.get("MyToken");
      
      console.log(`Deploying Vesting from account: ${second}`);
    
      const deployed = await deploy("Vesting", {
        from: first,
        args: [second, amount, duration, token.address],
        log: true,
      });

      console.log("🧾 vesting deployed at:", deployed.address);
    };
module.exports.tags = ["all"]
