const {getNamedAccounts, ethers, deployments} = require("hardhat")
const { expect } = require("chai");
const { expectEventFromReceipt } = require("../utils/events");
const {DEVELOPMENT_ENVIRONMENT_CHAINS} = require("../../helper.hardhat.config")

let vesting;
let token;
let first;
let second;

let firstSigner;
let secondSigner;


before(async function () {
      await deployments.fixture(["all"]);
    // 部署token 
    vesting = await ethers.getContract("Vesting");
    token = await ethers.getContract("MyToken");
    const accounts = await getNamedAccounts();
    first = accounts.first;
    second = accounts.second;

    const signers = await ethers.getSigners();
    firstSigner = signers[0]; 
    secondSigner = signers[1]; 

});

describe("claim", async function() {
    it("fail: no permission", async function() {

        await expect(vesting.claim())
        .to.be.revertedWith("no permission");
    });

    it("success", async function() {

        await token.mint(vesting.target, ethers.parseUnits("1000", 18));
        const [, beneficiary] = await ethers.getSigners();

        if (DEVELOPMENT_ENVIRONMENT_CHAINS.includes(network.name)) {
        // 模拟时间推进
            console.log("mock Waiting 30 seconds...");
            await network.provider.send("evm_increaseTime", [30]); // 推进 30 秒
            await network.provider.send("evm_mine");
        } else {
            console.log("Waiting 30 seconds...");
            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
            await sleep(30_000);
        }

        const balBefore = await token.balanceOf(beneficiary.address);
        const tx = await vesting.connect(beneficiary).claim();


        const receipt = await tx.wait();
        const balAfter = await token.balanceOf(beneficiary.address);

        // 断言领取了部分金额
        expect(balAfter).to.be.gt(balBefore);

        // 事件断言
        const claimedTopic = vesting.interface.getEvent("Claimed").topicHash;
        const log = receipt.logs.find(log => log.topics[0] === claimedTopic);
        expect(log).to.not.be.undefined;
    });

});

       


