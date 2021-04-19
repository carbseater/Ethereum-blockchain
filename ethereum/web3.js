import Web3 from 'web3'

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    console.log('no')
    web3 = new Web3(window.ethereum);
} else {
    console.log("yes")
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/98b05941eb55459f9e28a8f14c532b37'
    )
    web3 = new Web3(provider)
}

export default web3;