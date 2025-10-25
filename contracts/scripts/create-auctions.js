const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("Creating test auctions on SimpleFHEAuction contract...\n");

  const contractAddress = "0x9845302A5a101f5cC815425f99f90013BFa87B59";
  const [deployer] = await ethers.getSigners();

  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Get contract instance
  const SimpleFHEAuction = await ethers.getContractFactory("SimpleFHEAuction");
  const auction = SimpleFHEAuction.attach(contractAddress);

  // Create 6 test auctions with different parameters
  const testAuctions = [
    {
      name: "Aave Protocol Debt Claim #1234",
      startPrice: ethers.parseEther("20"), // 20 ETH starting price
      duration: 3 * 24 * 60 * 60, // 3 days
    },
    {
      name: "CryptoPunk NFT Rights",
      startPrice: ethers.parseEther("40"), // 40 ETH starting price
      duration: 6 * 60 * 60, // 6 hours
    },
    {
      name: "Compound Liquidation Asset",
      startPrice: ethers.parseEther("15"), // 15 ETH starting price
      duration: 2 * 24 * 60 * 60, // 2 days
    },
    {
      name: "Governance Token Package",
      startPrice: ethers.parseEther("10"), // 10 ETH starting price
      duration: 4 * 24 * 60 * 60, // 4 days
    },
    {
      name: "MakerDAO Vault Debt",
      startPrice: ethers.parseEther("30"), // 30 ETH starting price
      duration: 5 * 60 * 60, // 5 hours
    },
    {
      name: "Rare NFT Collection Bundle",
      startPrice: ethers.parseEther("60"), // 60 ETH starting price
      duration: 3 * 24 * 60 * 60, // 3 days
    },
  ];

  for (let i = 0; i < testAuctions.length; i++) {
    const auctionData = testAuctions[i];

    try {
      console.log(`\n[${i + 1}/${testAuctions.length}] Creating auction: ${auctionData.name}`);
      console.log(`  Starting Price: ${ethers.formatEther(auctionData.startPrice)} ETH`);
      console.log(`  Duration: ${auctionData.duration / 3600} hours`);

      const tx = await auction.createAuction(
        auctionData.startPrice,
        auctionData.duration,
        { gasLimit: 3000000 }
      );

      console.log(`  Transaction hash: ${tx.hash}`);
      console.log(`  Waiting for confirmation...`);

      const receipt = await tx.wait();
      console.log(`  ✅ Auction created successfully! (Block: ${receipt.blockNumber})`);

      // Small delay between transactions
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`  ❌ Failed to create auction: ${error.message}`);
    }
  }

  console.log("\n✅ All auctions created successfully!");
  console.log(`\nView auctions at: https://sepolia.etherscan.io/address/${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
