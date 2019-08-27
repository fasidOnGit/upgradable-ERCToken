const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const compiledToken = require('../ethereum/build/Token_V0');

let accounts;
let tokenAddress;
let token;

describe('Token_VO', () => {
    beforeEach(async () => {
      accounts = await web3.eth.getAccounts();
      token = await new web3.eth.Contract(compiledToken.abi)
          .deploy({data: compiledToken.evm.bytecode.object, arguments: [accounts[0], accounts[1]]})
          .send({from: accounts[0], gas: '3000000'});
      token.setProvider(provider);
    });

    it('deploys a contract', () => {
        console.log(token.options.address);
        assert.ok(token.options.address);
    });

    it('#balanceOf', async () => {
       await token.methods.balanceOf(accounts[0]).call();
    });
});