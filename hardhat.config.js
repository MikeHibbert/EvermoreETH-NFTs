/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");

const { API_URL, DEV_API_URL, PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.7.3",
   defaultNetwork: "rinkeby",
   gasReporter: {
      enabled: true
   },
   loggingEnabled: true,
   networks: {
      hardhat: {},
      rinkeby: {
         url: DEV_API_URL,
         accounts: [`0x${PRIVATE_KEY}`],
         gasPrice: 67000000000,
         gas: 500000
      },
      mainnet: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`],
         gasPrice: 63000000000,
         gas: 500000
      }
   },
}