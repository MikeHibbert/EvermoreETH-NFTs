async function main() {
    const EvermoreNFT = await ethers.getContractFactory("EvermoreNFT");
    
    // Start deployment, returning a promise that resolves to a contract object
    const evermoreNFT = await EvermoreNFT.deploy();
    console.log("Contract deployed to address:", evermoreNFT.address);
 }
 
 main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });