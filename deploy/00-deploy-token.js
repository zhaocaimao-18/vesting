const {  DECIMAL,TOKEN_NAME,SYMBOL_TOKEN } = require("../helper.hardhat.config")


module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy } = deployments;
      const { first } = await getNamedAccounts();
    
      console.log(`Deploying Token from account: ${first}`);
    
      const deployed = await deploy("MyToken", {
        // contract: "MyToken",
        from: first,
        args: [TOKEN_NAME, SYMBOL_TOKEN, DECIMAL],
        log: true,
      });

      console.log("🧾 Token deployed at:", deployed.address);
    };
module.exports.tags = ["all"]
