require('dotenv').config();
const fs = require('fs');
const API_URL = process.env.API_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/EvermoreNFT.sol/EvermoreNFT.json"); 
const contractAddress = "0x19A5851e117Fb3Abd23718b03FA2E5554141170A";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress); 

const Arweave = require('arweave');
const arweave = Arweave.init(
    {
        host: 'arweave.net',// Hostname or IP address for a Arweave host
        port: 443,          // Port
        protocol: 'https',  // Network protocol http or https
        timeout: 20000,     // Network request timeouts in milliseconds
        logging: false,     // Enable network request logging
    }
);
const wallet1_str = fs.readFileSync('/home/mike/Documents/Arweave/arweave-keyfile-h-Bgr13OWUOkRGWrnMT0LuUKfJhRss5pfTdxHmNcXyw.json');
const wallet1 = JSON.parse(wallet1_str);

const mintNFT = async (tokenURI) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        'gas': 500000,
        'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    signPromise.then((signedTx) => {

        web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
        if (!err) {
            console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
        } else {
            console.log("Something went wrong when submitting your transaction:", err);
        }
        });
    }).catch((err) => {
        console.log(" Promise failed:", err);
    });
}


arweave.transactions.get('X6rUXIvJeK7Jyd5zCEGnyXw4dRKEaJTsTvhtDAhG_gc').then(async transaction => {
    transaction.get('tags').forEach(tag => {
        let key = tag.get('name', {decode: true, string: true});
        let value = tag.get('value', {decode: true, string: true});

        if(key == 'Init-State') {
            transaction[key] = JSON.parse(value)
        } else {
            transaction[key] = value;
        }
    });

    debugger;

    const imageURL = 'https://arweave.net/X6rUXIvJeK7Jyd5zCEGnyXw4dRKEaJTsTvhtDAhG_gc';
    const name = transaction['Init-State'].name;
    const description = transaction['Init-State'].description;

    const metadata = {
        "name": name,
        "description": description,
        "image": imageURL,
        "attributes":[]
    };

    const tx = await arweave.createTransaction({
        data: JSON.stringify(metadata)
    }, wallet1);

    tx.addTag('EVERMORE_NFT_METADATA', 'ETH NETWORK DATA');
    tx.addTag('Content-Type', 'application/json');

    await arweave.transactions.sign(tx, wallet1);
    await arweave.transactions.post(tx);

    await mintNFT(`https://arweave.net/${tx.id}`);
});


