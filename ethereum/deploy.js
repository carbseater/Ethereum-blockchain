const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'edit page vacant jealous dutch confirm until trim swap kiwi very advance',
    'https://rinkeby.infura.io/v3/98b05941eb55459f9e28a8f14c532b37'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    // console.log(accounts);
    console.log("Deployment from account ", accounts[0]);
    
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });
    // console.log(compiledFactory.interface)
    console.log("Contract deployed at ",result.options.address);
}

deploy();