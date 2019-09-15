const {ZERO_ADDRESS} = require("./utils");

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const tokenV0Compiled = require('../ethereum/build/Token_V0');
const balanceSheetCompiled = require('../ethereum/build/BalanceSheet');
const allowanceSheetCompiled = require('../ethereum/build/AllowanceSheet');
const tokenProxyCompiled = require('../ethereum/build/TokenProxy');


const PROVIDER = new HDWalletProvider(MNEMONICS, RINEKEY_NODE);

const web3 = new Web3(PROVIDER);

const deploy = async ({abi, data, arguments, isBigShot}) => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    console.log('Balance is ', await web3.eth.getBalance(accounts[0]));
    return new web3.eth.Contract(abi)
        .deploy({
            data: '0x' + data,
            arguments
        })
        .send({from: accounts[0], gas: isBigShot ? '5000000' : '1000000'})
};

(async () => {
    const balanceSheet = await deploy({
        abi: balanceSheetCompiled.abi,
        data: balanceSheetCompiled.evm.bytecode.object,
        arguments: []
    });
    // console.log(balanceSheet);
    console.log('BalanceSheet deployed to', balanceSheet.options.address);

    const allowanceSheet = await deploy({
        abi: allowanceSheetCompiled.abi,
        data: allowanceSheetCompiled.evm.bytecode.object,
        arguments: []
    });
    // console.log(allowanceSheet);
    console.log('AllowanceSheet deployed to', allowanceSheet.options.address);

    const tokenV0 = await deploy({
        abi: tokenV0Compiled.abi,
        data: tokenV0Compiled.evm.bytecode.object,
        arguments: [
            ZERO_ADDRESS,
            ZERO_ADDRESS
        ],
        isBigShot: true
    });

    console.log('Token_V0 deployed to', tokenV0.options.address);

    const tokenProxy = await deploy({
        abi: tokenProxyCompiled.abi,
        data: tokenProxyCompiled.evm.bytecode.object,
        arguments: [
            '0x759Cb121D2b8d2aA20E0e5B4280B5604eC0555B6', //token
            '0xB1B0D1Ee35FeCEfD496332e98042F9eAb61e46F8', //balance
            '0x6d52A606dF0aCbcB4583159a987edE618506774a' //allowance
        ],
        isBigShot: true
    });

    console.log('Token proxy deployed to', tokenProxy.options.address);

})();