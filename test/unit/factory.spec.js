const {getNamedAccounts, ethers, deployments} = require("hardhat")
const { expect } = require("chai");

let firstAccount;
let factory;


before(async function () {
  await deployments.fixture(["all"]);

    try {
    console.log("ethers.getContract is", typeof ethers?.getContract);
  } catch (e) {
    console.log("ethers or ethers.getContract not available:", e.message);
  }


  const accounts = await getNamedAccounts();
  firstAccount = accounts.first;

  factory = await ethers.getContract("VestingFactory");

  // console.log("factory:", factory);
});

describe("test createVesting", function () {
  it("factory create vesting success", async function () {
    const tx = await factory.createVesting(
      firstAccount,
      ethers.parseUnits("1200", 18),
      30 * 24 * 3600 * 12
    );

    await tx.wait();
    const logs = await factory.queryFilter("VestingCreated");
    const event = logs[0]; // 拿第一个事件
    const vestingAddress = event.args.vesting;

    const vesting = await ethers.getContractAt("Vesting", vestingAddress); // ✅ 同样使用 getContractAt
    expect(await vesting.beneficiary()).to.equal(firstAccount);

    const allVestings = await factory.getAllVestingAddresses();
    expect(allVestings).to.include(vestingAddress);
  });
});
