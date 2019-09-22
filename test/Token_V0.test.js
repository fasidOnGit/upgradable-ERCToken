const {ZERO_ADDRESS} = require("../ethereum/utils");

const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const tokenV0Compiled = require('../ethereum/build/Token_V0');
const balanceSheetCompiled = require('../ethereum/build/BalanceSheet');
const allowanceSheetCompiled = require('../ethereum/build/AllowanceSheet');
const tokenProxyCompiled = require('../ethereum/build/TokenProxy');

let accounts;
let tokenAddress;
let token, balanceSheet, allowanceSheet, tokenProxy;

describe('Token_VO', () => {
    beforeEach(async () => {
      accounts = await web3.eth.getAccounts();
        /**
         * Deploys TokenV0 with some dummy zero addresses.
         * @type {Contract}
         */
        token = await new web3.eth.Contract(tokenV0Compiled.abi)
            .deploy({
                data: tokenV0Compiled.evm.bytecode.object,
                arguments: [
                    ZERO_ADDRESS,
                    ZERO_ADDRESS
                ]
            })
            .send({from: accounts[0], gas: '5000000'});

      // Deploys BalanceSheet..
      balanceSheet = await new web3.eth.Contract(balanceSheetCompiled.abi)
          .deploy({data: balanceSheetCompiled.evm.bytecode.object})
          .send({from: accounts[0], gas: '1000000', gasPrice: '12334545'});

        /**
         * Deploys AllowanceSheet
         * @type {Contract}
         */
      allowanceSheet = await new web3.eth.Contract(allowanceSheetCompiled.abi)
          .deploy({data: allowanceSheetCompiled.evm.bytecode.object})
          .send({from: accounts[0], gas: '1000000', gasPrice: '12334545'});


        /**
         * Deploys TokenProxy with the deployed addresses of token, balancesSheet and allowanceSheet.
         * @type {Contract}
         */
      tokenProxy = await new web3.eth.Contract(tokenProxyCompiled.abi)
          .deploy({
              data: tokenProxyCompiled.evm.bytecode.object,
              arguments: [
                  token.options.address,
                  balanceSheet.options.address,
                  allowanceSheet.options.address
              ]
          }).send({from: accounts[0], gas: '5000000'});

        /**
         * Sets the provider.
         */
      token.setProvider(provider);
      balanceSheet.setProvider(provider);
      allowanceSheet.setProvider(provider);
      tokenProxy.setProvider(provider);
      console.log("I am called")
    });

    it('deploys a contract', () => {
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

    describe('Proxy delegates calls to token logic contract', async () => {
       let proxy;
        beforeEach(async () => {
           proxy = await new web3.eth.Contract(tokenV0Compiled.abi, tokenProxy.options.address);
           proxy.setProvider(provider);
           await allowanceSheet.methods.transferOwnership(proxy.options.address).send({from: accounts[0], gas: '1000000'});
           await balanceSheet.methods.transferOwnership(proxy.options.address).send({from: accounts[0], gas: '1000000'});
           await proxy.methods.claimBalanceOwnership().send({from: accounts[0], gas: '1000000'});
           await proxy.methods.claimAllowanceOwnership().send({from: accounts[0], gas: '1000000'});
       });

        it('tokenProxy owns data storages', async () => {
            assert.strictEqual(proxy.options.address, await allowanceSheet.methods.owner().call());
            assert.strictEqual(proxy.options.address, await balanceSheet.methods.owner().call());
        });

        it('returns totalSupply', async () => {
            const supply = await proxy.methods.totalSupply().call();
            assert.strictEqual(supply, 0)
        });
        it('approve', async () => {
           await proxy.methods.approve(token.options.address, 100)
               .send({from: accounts[0], gas: '1000000'});
        });
    });
});