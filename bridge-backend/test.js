const LZstring = require('lz-string');
const Web3 = require('web3');


let addr = `0x${LZstring.compress('222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473')}0`;
const convertedAddress = Web3.utils.utf8ToHex(LZstring.compress('222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473').toString());

const value = addr.slice(2,31)
console.log(LZstring.decompress(value), convertedAddress)