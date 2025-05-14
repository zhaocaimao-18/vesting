// const {  DECIMAL,TOKEN_NAME,SYMBOL_TOKEN } = require("../helper.hardhat.config")


module.exports = async ({ getNamedAccounts, deployments }) => {
      const { deploy } = deployments;
      const { first } = await getNamedAccounts();
    
      console.log(`Deploying VestingFactory from account: ${first}`);

      const token = await deployments.get("MyToken");
      console.log(`get mytoken from deployments : ${token.address}`);
      const deployed = await deploy("VestingFactory", {
        // contract: "MyToken",
        from: first,
        args: [token.address],
        log: true,
      });

      console.log("🧾 VestingFactory deployed at:", deployed.address);
    };
module.exports.tags = ["all"]
