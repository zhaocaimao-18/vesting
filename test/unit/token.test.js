const {getNamedAccounts, ethers, deployments} = require("hardhat")
const { expect } = require("chai");
const { expectEventFromReceipt } = require("../utils/events");

let token;

let first;
let second;


before(async function () {
      await deployments.fixture(["all"]);
    // 部署token 
      token = await ethers.getContract("MyToken");

      const accounts = await getNamedAccounts();
      first = accounts.first;
      second = accounts.second;

});

    describe("test mint", async function() {
        it("success", async function() {
            const amount = ethers.parseUnits("1200", 18);
            const tx = await token.mint(second, amount);
            const receipt = await tx.wait();
            console.log("✅ Transaction hash:", receipt.transactionHash);
            await expectEventFromReceipt(
                receipt,
                "MyToken",
                "Transfer",
                [ethers.ZeroAddress, second]
              );

            // 断言余额更新成功
            const balance = await token.balanceOf(second);
            expect(balance).to.equal(amount);
        } );

        it("fail: msg.sender != owner", async function() {
            const signers = await ethers.getSigners();
            secondSigner = signers[1]; 
            const amount = ethers.parseUnits("1200", 18);
            await expect(token.connect(secondSigner).mint(second, amount))
            .to.be.revertedWithCustomError(token, "NotOwner");
        });

    });

    describe("test transfer", async function() {
        it("success", async function() {
            // first mint second 1200
            // seond transter first 1000;
            // check first 1000
            // check second 200
            const firstBefore = await token.balanceOf(first);     // BigInt
            const secondBefore = await token.balanceOf(second);   // BigInt
            const amount = ethers.parseUnits("1200", 18);
            const amountTransferred = ethers.parseUnits("1000", 18);
            const tx = await token.mint(second, amount);
            await tx.wait();
            const signers = await ethers.getSigners();
            secondSigner = signers[1]; 
            const tx1 = await token.connect(secondSigner).transfer(first, amountTransferred);
            const receipt = await tx1.wait();
            const firstAfter = await token.balanceOf(first);
            const secondAfter = await token.balanceOf(second);
            expect(firstAfter).to.equal(firstBefore + amountTransferred);
            expect(secondAfter).to.equal(secondBefore + (amount - amountTransferred));
            await expectEventFromReceipt(
                receipt,
                "MyToken",
                "Transfer",
                [second, first]
              );
        } );
        it("fail: no enough balance to transfer", async function() {
            const firstBefore = await token.balanceOf(first);
            const amount = firstBefore + 200n;

            await expect(token.transfer(second, amount))
            .to.be.revertedWithCustomError(token, "InsufficientBalance");
        });

    });

    describe("test approve", async function() {
        it("success", async function() {
            const amount = ethers.parseUnits("1200", 18);
            // 调用 检查 event
            const tx = await token.approve(second, amount);
            const receipt = await tx.wait();
            await expectEventFromReceipt(
            receipt,
            "MyToken",
            "Approval",
            [first, second]
            );
            const allowance = await token.allowance(first, second);
            expect(allowance).to.equal(amount);
        }); 
    });


    //     function transferFrom(address from, address to, uint256 amount)  public returns (bool) {

    //     require(balances[from] >= amount, "Insufficient balance");
    //     require(_allowance[from][msg.sender] >= amount, "Not allowed");

    //     balances[from] -= amount;
    //     balances[to] += amount;
    //     _allowance[from][msg.sender] -= amount;

    //     emit Transfer(from, to, amount);
    //     return true;

    // }

    describe("test transferFrom", async function() {
        it("fail: Insufficient balance", async function() {
            const firstBefore = await token.balanceOf(first);
            const amount = firstBefore + 200n;
            await expect(token.transferFrom(first, second, amount))
            .to.be.revertedWith("Insufficient balance");
        }); 
        it("fail: no approval", async function() {
            const firstBefore = await token.allowance(first, second);
            const amount = firstBefore + 200n;
            const tx = await token.mint(first, amount);
            const receipt = await tx.wait();
            await expect(token.transferFrom(first, second, amount))
            .to.be.revertedWith("Not allowed");
        });

        it("fail: no approval", async function() {
            const firstBefore = await token.allowance(first, second);
            const amount = firstBefore + 200n;
            const tx = await token.mint(first, amount);
            const receipt = await tx.wait();
            await expect(token.transferFrom(first, second, amount))
            .to.be.revertedWith("Not allowed");
        });

        it("success", async function() {
            const amountA = await token.balanceOf(first);
            const amountB = await token.balanceOf(second);

            const transferFromAmount = ethers.parseUnits("800", 18);

            const signers = await ethers.getSigners();
            secondSigner = signers[1]; 
            const tx = await token.connect(secondSigner).transferFrom(first, second, transferFromAmount);
            const receipt = await tx.wait();
            
            const afterA = await token.balanceOf(first);
            const afterB = await token.balanceOf(second);

            expect(afterA).to.equal(amountA - transferFromAmount);
            expect(afterB).to.equal(amountB + transferFromAmount);
            await expectEventFromReceipt(
            receipt,
            "MyToken",
            "Transfer",
            [first, second]
            );
        });

       
    });



