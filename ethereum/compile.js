const {findImports, compile} =  require("./utils");
const fs = require('fs-extra');
const path = require('path');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
const tokenV0 = 'Token_V0.sol';
const tokenV0Path = path.resolve(__dirname, 'contracts/token', tokenV0);
compile(tokenV0Path, tokenV0);
const contracts = {
    [tokenV0]: tokenV0Path,
    'Token_V1.sol': path.resolve(__dirname, 'contracts/token', 'Token_V1.sol'),
    'TokenProxy.sol': path.resolve(__dirname, 'contracts/proxy', 'TokenProxy.sol'),
};
fs.removeSync(buildPath);
for(const contract in contracts) {
    if (contracts.hasOwnProperty(contract)) {
        compile(contracts[contract], contract);
    }
}