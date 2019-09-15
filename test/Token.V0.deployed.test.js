const assert = require("assert");

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const tokenV0Compiled = require('../ethereum/build/Token_V0');
const balanceSheetCompiled = require('../ethereum/build/BalanceSheet');
const allowanceSheetCompiled = require('../ethereum/build/AllowanceSheet');
const tokenProxyCompiled = require('../ethereum/build/TokenProxy');

const MNEMONICS = 'word win world fall valid field awkward tool bridge knee blush afford';
const RINEKEY_NODE = 'https://rinkeby.infura.io/v3/53f8390b02fe40b4961e11cfe5d79f20';

const PROVIDER = new HDWalletProvider(MNEMONICS, RINEKEY_NODE);

const web3 = new Web3(PROVIDER);

let accounts;
let tokenAddress;
let token, balanceSheet, allowanceSheet, tokenProxy;

describe('Rinkeby deployed testing', async () => {
   beforeEach(async () => {
       accounts = await web3.eth.getAccounts();

       balanceSheet = await new web3.eth.Contract(balanceSheetCompiled.abi, '0xB1B0D1Ee35FeCEfD496332e98042F9eAb61e46F8');
       allowanceSheet = await new web3.eth.Contract(allowanceSheetCompiled.abi, '0x6d52A606dF0aCbcB4583159a987edE618506774a');
       token = await new web3.eth.Contract(tokenV0Compiled.abi, '0x759Cb121D2b8d2aA20E0e5B4280B5604eC0555B6');
       tokenProxy = await new web3.eth.Contract(tokenProxyCompiled.abi, '0xCaD9f148ED903441948e2906b7A99699261eE206');

       token.setProvider(PROVIDER);
       balanceSheet.setProvider(PROVIDER);
       allowanceSheet.setProvider(PROVIDER);
       tokenProxy.setProvider(PROVIDER);
   });

    it('deploys a contract', async () => {
        console.log(
            await web3.eth.getBalance(accounts[0])
        );
        assert.ok(token.options.address);
        assert.ok(balanceSheet.options.address);
        assert.ok(allowanceSheet.options.address);
        assert.ok(tokenProxy.options.address);
    });

    it('#implementation', async () => {
        const implementation = await tokenProxy.methods.implementation()
            .call();
        assert.strictEqual(implementation, token.options.address);
    });

    describe('Proxy delegates calls to token logic contract', async function () {
        let proxy;
        this.timeout(35000000000000000000);
        beforeEach(async () => {
            proxy = await new web3.eth.Contract(tokenV0Compiled.abi, tokenProxy.options.address);
            console.log(proxy.options.address);
            await allowanceSheet.methods.transferOwnership(token.options.address).send({from: accounts[0], gas: '1000000'});
            await balanceSheet.methods.transferOwnership(proxy.options.address).send({from: accounts[0], gas: '1000000'});
            // await yes(30000);
            console.log(
                token.options.address,
                await allowanceSheet.methods.pendingOwner().call(),
                await balanceSheet.methods.pendingOwner().call()
            );

            await tokenProxy.methods.claimBalanceOwnership().send({from: accounts[0], gas: '1000000'});
            console.log('deodeo')
            await tokenProxy.methods.claimAllowanceOwnership().send({from: accounts[0], gas: '1000000'});
            console.log('kakakak')
        });

        it('tokenProxy owns data storages', async () => {
            console.log(await web3.eth.getBalance(accounts[0]));
            assert.strictEqual(proxy.options.address, await allowanceSheet.methods.owner().call());
            assert.strictEqual(proxy.options.address, await balanceSheet.methods.owner().call());
        })
    });
});

function yes(timeout) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}