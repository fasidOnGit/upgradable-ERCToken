const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const tokenV0Compiled = require('../ethereum/build/Token_V0');
const balanceSheetCompiled = require('../ethereum/build/BalanceSheet');
const allowanceSheetCompiled = require('../ethereum/build/AllowanceSheet');

let accounts;
let tokenAddress;
let token, balanceSheet, allowanceSheet;

describe('Token_VO', () => {
    beforeEach(async () => {
      accounts = await web3.eth.getAccounts();

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
         * Deploys TokenV0 with the deployed address from BalanceSheet and AllowanceSheet.
         * @type {Contract}
         */
      token = await new web3.eth.Contract(tokenV0Compiled.abi)
          .deploy({
              data: tokenV0Compiled.evm.bytecode.object,
              arguments: [
                  balanceSheet.options.address,
                  allowanceSheet.options.address
              ]
          })
          .send({from: accounts[0], gas: '5000000'});
      token.setProvider(provider);
      balanceSheet.setProvider(provider);
      allowanceSheet.setProvider(provider);
    });

    it('deploys a contract', () => {
        assert.ok(token.options.address);
        assert.ok(balanceSheet.options.address);
        assert.ok(allowanceSheet.options.address);
    });
    it('#what', async () => {
        const hello = await token.methods.what().call({
            from: accounts[2]
        });
        console.log(hello);
    });

    it('#balanceOf', async () => {
       const balance = await token.methods.balanceOf(
            accounts[2]
       ).call({from: accounts[1]});
       console.log(balance);
    });

    it('#mint', async () => {
        console.log(await token.methods.mint(accounts[1], 22).call({
            from: accounts[0]
        }));
        console.log(await token.methods.totalSupply().call())
    });

    it('#totalSupply', async () => {
       console.log(await token.methods.totalSupply().call())
    });
});