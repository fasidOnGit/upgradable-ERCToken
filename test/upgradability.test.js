const {ZERO_ADDRESS} = require("../ethereum/utils");

const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const tokenV0Compiled = require('../ethereum/build/Token_V0');
const tokenV1Compiled = require('../ethereum/build/Token_V1');
const tokenProxyCompiled = require('../ethereum/build/TokenProxy');

let accounts;
let tokenAddress;
let token, token_v1, tokenProxy, proxy, proxy_v1;

describe('Token V0, Eternal Storage', () => {
    beforeEach(async () => {
        accounts = await web3.eth.getAccounts();
        /**
         * Deploys TokenV0 with some dummy zero addresses.
         * @type {Contract}
         */
        token = await new web3.eth.Contract(tokenV0Compiled.abi)
            .deploy({
                data: tokenV0Compiled.evm.bytecode.object,
            })
            .send({from: accounts[0], gas: '5000000'});


        /**
         * Deploys TokenProxy with the deployed addresses of token, balancesSheet and allowanceSheet.
         * @type {Contract}
         */
        tokenProxy = await new web3.eth.Contract(tokenProxyCompiled.abi)
            .deploy({
                data: tokenProxyCompiled.evm.bytecode.object,
                arguments: [
                    token.options.address
                ]
            }).send({from: accounts[0], gas: '5000000'});
        proxy = await new web3.eth.Contract(tokenV0Compiled.abi, tokenProxy.options.address);
        proxy.setProvider(provider);
        /**
         * Sets the provider.
         */
        token.setProvider(provider);
        tokenProxy.setProvider(provider);
    });

    it('deploys a contract', () => {
        assert.ok(token.options.address);
        assert.ok(tokenProxy.options.address);
    });

    it('returns totalSupply', async () => {
        const supply = await proxy.methods.getTotalSupply().call();
        console.log(supply);
        assert.strictEqual(parseInt(supply), 0)
    });

    it('mint, upgrade and verify totalSupply.', async () => {
        await proxy.methods.mint(accounts[1], 100).send({
            from: accounts[0],
            gas: '1000000'
        });
        console.log(
            await proxy.methods.getBalance(accounts[1]).call(),
            await proxy.methods.getTotalSupply().call()
        );

        token_v1= await new web3.eth.Contract(tokenV1Compiled.abi)
            .deploy({
                data: tokenV1Compiled.evm.bytecode.object,
            })
            .send({from: accounts[0], gas: '5000000'});
        token_v1.setProvider(provider);

        console.log(
            'Token_v0 Implementation',
            await tokenProxy.methods.implementation().call()
        );
        await tokenProxy.methods.upgradeTo(token_v1.options.address).send({
            from: accounts[0],
            gas: '1000000'
        });
        console.log(
            'Token_v1 Implementation',
            await tokenProxy.methods.implementation().call()
        );
        proxy_v1 = await new web3.eth.Contract(tokenV1Compiled.abi, tokenProxy.options.address);
        console.log(
            'Total supply v1',
            await proxy_v1.methods.getTotalSupply().call()
        );
        console.log(
            await proxy_v1.methods.unlock().send({
                from: accounts[0],
                gas: '100000'
            })
        );
        console.log(
            'Increase',
            await proxy_v1.methods.increaseApproval(accounts[1], 100).send({
                from: accounts[0],
                gas: '100000'
            })
        )

    });

    describe('upgrade v1', async () => {
        beforeEach(async () => {
            proxy_v1 = await new web3.eth.Contract(tokenV1Compiled.abi, tokenProxy.options.address);
        });

        it('burn', async () => {
            await proxy_v1.methods.mint(accounts[0], 100).send({
                from: accounts[0],
                gas: '90000'
            });
            console.log(
                await proxy_v1.methods.getTotalSupply().call()
            );
            console.log(
                await proxy_v1.methods.burn(1).send({
                    from: accounts[0],
                    gas: '100000'
                })
            );
            console.log(
                await proxy_v1.methods.getTotalSupply().call()
            );
        })
    })
});