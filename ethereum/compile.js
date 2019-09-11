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
    'BalanceSheet.sol': path.resolve(__dirname, 'contracts/', 'BalanceSheet.sol'),
    'AllowanceSheet.sol': path.resolve(__dirname, 'contracts/', 'AllowanceSheet.sol')
};
fs.removeSync(buildPath);
for(const contract in contracts) {
    if (contracts.hasOwnProperty(contract)) {
        compile(contracts[contract], contract);
    }
}
// const source = fs.readFileSync(campaignPath, 'utf-8');
// const input = {
//     language: 'Solidity',
//     sources: {
//         'Token_V0.sol': {
//             content: source
//         }
//     },
//     settings: {
//         outputSelection: {
//             '*': {
//                 '*': [ '*' ]
//             }
//         }
//     }
// };
// console.log(JSON.parse(solc.compile(JSON.stringify(input), findImports(__dirname + '/contracts'))));
// const output = JSON.parse(solc.compile(JSON.stringify(input), findImports(__dirname + '/contracts'))).contracts['Token_V0.sol'];
//
// fs.ensureDirSync(buildPath);
//
// for(let contract in output) {
//     fs.outputJsonSync(
//         path.resolve(buildPath, contract + '.json'),
//         output[contract]
//     );
// }