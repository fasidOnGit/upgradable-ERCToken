This is based on the excellant blog post [here](https://medium.com/carbon-money/how-to-build-and-deploy-a-full-stack-upgradeable-erc-20-dapp-81a7e35e374)

> data-copying on-chain is expensive so isolating data storage from the logic supports future upgrades.

## The Roadmap
1. Token implementation V0: This will be a Standard ERC20 capable of minting new tokens, burning tokens, and of course transferring (Done!)

2. Token implementation V1: We’ll add a few security features to V0 such as pausability and defense against double-spend attacks
3. Token proxy: From the user’s point of view, they will have no clue that they are actually interacting with and using a ‘proxy’ contract as opposed to one of the V0/V1 token contracts, but the proxy is the key to enabling flexible upgradeability
4. Deploying our smart contracts on a testnet: This part can be tricky, so we’ll use Infura for convenience and I’ll show you how to write useful deployment scripts
5. dApp time: We will use React, Redux, and Material-UI to build a simple, elegant wallet to interface with our smart contracts!



