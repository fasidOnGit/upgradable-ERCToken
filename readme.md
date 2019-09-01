This is based on the excellant blog post [here](https://medium.com/carbon-money/how-to-build-and-deploy-a-full-stack-upgradeable-erc-20-dapp-81a7e35e374)

> data-copying on-chain is expensive so isolating data storage from the logic supports future upgrades.

## The Roadmap
1. Token implementation V0: This will be a Standard ERC20 capable of minting new tokens, burning tokens, and of course transferring (Done!)

2. Token implementation V1: We’ll add a few security features to V0 such as pausability and defense against double-spend attacks
3. Token proxy: From the user’s point of view, they will have no clue that they are actually interacting with and using a ‘proxy’ contract as opposed to one of the V0/V1 token contracts, but the proxy is the key to enabling flexible upgradeability
4. Deploying our smart contracts on a testnet: This part can be tricky, so we’ll use Infura for convenience and I’ll show you how to write useful deployment scripts
5. dApp time: We will use React, Redux, and Material-UI to build a simple, elegant wallet to interface with our smart contracts!




## Key Notes:
 * One of the advantages of Ethereum is that every transaction made to a contract is _immutable_ on a public ledger we call the blockchain.
 
 * This enables smart contracts to enforce a verified set of promises and is the main reason why there is so uch excitment about thier potential for forming the foundation of the next great digital revolution.
 
 * __But the disadvantages__ is that you cannot change the source code of your smart contract after it's been deployed. (remember there is no overwriting the smart contract!).
 
 * __Fix:__ A Proxy architecture pattern
 
## Proxy architecture pattern
 > _A proxy achitecture pattern is such that all message calls go via a Proxy contract that will redirect them to the latest deployed contract logic._

* To upgrade, new version of your contract is deployed, and the Proxy is updated to reference the new contract address.

* A proxy contract uses the delegatecall opcode to forward function calls to a target contract which can be updated

* As delegatecall retains the state of the function call, the target contract’s logic can be updated and the state will remain in the proxy contract for the updated target contract’s logic to use

* As with delegatecall, the msg.sender will remain that of the caller of the proxy contract.
