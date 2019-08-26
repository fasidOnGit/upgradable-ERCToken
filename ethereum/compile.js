const {findImports} =  require("./utils");

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts/token', 'Token_V0.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const input = {
    language: 'Solidity',
    sources: {
        'Token_V0.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
};
// console.log(JSON.parse(solc.compile(JSON.stringify(input), findImports(__dirname + '/contracts'))));
const output = JSON.parse(solc.compile(JSON.stringify(input), findImports(__dirname + '/contracts'))).contracts['Token_V0.sol'];

fs.ensureDirSync(buildPath);

for(let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract + '.json'),
        output[contract]
    );
}