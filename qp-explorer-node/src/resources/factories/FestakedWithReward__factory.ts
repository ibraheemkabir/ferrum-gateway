/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  FestakedWithReward,
  FestakedWithRewardInterface,
} from "../FestakedWithReward";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "address",
        name: "tokenAddress_",
        type: "address",
      },
      {
        internalType: "address",
        name: "rewardTokenAddress_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "stakingStarts_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingEnds_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawStarts_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawEnds_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingCap_",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "staker_",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestedAmount_",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stakedAmount_",
        type: "uint256",
      },
    ],
    name: "Staked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "withdrawableAmount",
        type: "uint256",
      },
    ],
    name: "addMarginalReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawableAmount",
        type: "uint256",
      },
    ],
    name: "addReward",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "earlyWithdrawReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardSetter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardState",
    outputs: [
      {
        internalType: "uint256",
        name: "rewardBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardsTotal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "earlyWithdrawReward",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsTotal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stake",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "staker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "stakeFor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "stakeOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeState",
    outputs: [
      {
        internalType: "uint256",
        name: "stakedTotal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakingCap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "stakedBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawnEarly",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakedBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakedTotal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingCap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingEnds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingStarts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawEnds",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawStarts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001b1d38038062001b1d83398101604081905262000034916200041b565b87878686868686600160008190555086600290805190602001906200005b92919062000358565b506001600160a01b038616620000b85760405162461bcd60e51b815260206004820152601460248201527f46657374616b696e673a2030206164647265737300000000000000000000000060448201526064015b60405180910390fd5b600380546001600160a01b0319166001600160a01b038816179055846200012d5760405162461bcd60e51b815260206004820152602260248201527f46657374616b696e673a207a65726f207374616b696e672073746172742074696044820152616d6560f01b6064820152608401620000af565b4285101562000140574260045562000146565b60048590555b600454841015620001c05760405162461bcd60e51b815260206004820152603360248201527f46657374616b696e673a207374616b696e6720656e64206d757374206265206160448201527f66746572207374616b696e6720737461727473000000000000000000000000006064820152608401620000af565b6005849055838310156200023d5760405162461bcd60e51b815260206004820152603460248201527f46657374616b696e673a207769746864726177537461727473206d757374206260448201527f65206166746572207374616b696e6720656e64730000000000000000000000006064820152608401620000af565b600683905582821015620002ba5760405162461bcd60e51b815260206004820152603560248201527f46657374616b696e673a207769746864726177456e6473206d7573742062652060448201527f61667465722077697468647261772073746172747300000000000000000000006064820152608401620000af565b60079190915560085550505050506001600160a01b038616620003205760405162461bcd60e51b815260206004820152601b60248201527f46657374616b696e673a203020726577617264206164647265737300000000006044820152606401620000af565b5050600e80546001600160a01b039095166001600160a01b03199586161790555050601280549092163317909155506200059c915050565b828054620003669062000549565b90600052602060002090601f0160209004810192826200038a5760008555620003d5565b82601f10620003a557805160ff1916838001178555620003d5565b82800160010185558215620003d5579182015b82811115620003d5578251825591602001919060010190620003b8565b50620003e3929150620003e7565b5090565b5b80821115620003e35760008155600101620003e8565b80516001600160a01b03811681146200041657600080fd5b919050565b600080600080600080600080610100898b03121562000438578384fd5b88516001600160401b03808211156200044f578586fd5b818b0191508b601f83011262000463578586fd5b81518181111562000478576200047862000586565b604051601f8201601f19908116603f01168101908382118183101715620004a357620004a362000586565b81604052828152602093508e84848701011115620004bf578889fd5b8891505b82821015620004e25784820184015181830185015290830190620004c3565b82821115620004f357888484830101525b9b50620005059150508b8201620003fe565b985050506200051760408a01620003fe565b9550606089015194506080890151935060a0890151925060c0890151915060e089015190509295985092959890939650565b6002810460018216806200055e57607f821691505b602082108114156200058057634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61157180620005ac6000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c806361539de7116100b8578063a694fc3a1161007c578063a694fc3a146102c3578063aa5c3ab4146102d6578063b410e2a1146102de578063bb2d7f3a146102e7578063d66692a7146102ef578063eacebf61146102f757610142565b806361539de71461024b5780636d68c7d41461025e57806375c93bb9146102675780638c09a2f91461027a5780639d76ea58146102b057610142565b80632ee409081161010a5780632ee40908146101df5780633f7fd60a146101f257806342623360146101fa57806344c370d31461020d578063582c7928146102165780635b9f00161461024357610142565b806306fdde0314610147578063125f9e331461016557806321b13cdf146101905780632853c542146101a75780632e1a7d4d146101bc575b600080fd5b61014f610300565b60405161015c919061136a565b60405180910390f35b600e54610178906001600160a01b031681565b6040516001600160a01b03909116815260200161015c565b61019960065481565b60405190815260200161015c565b6101ba6101b53660046112fd565b610392565b005b6101cf6101ca3660046112fd565b61044c565b604051901515815260200161015c565b6101cf6101ed3660046112b4565b6104b0565b601154610199565b61019961020836600461129a565b6104c4565b61019960085481565b600f5460105460115461022892919083565b6040805193845260208401929092529082015260600161015c565b600b54610199565b601254610178906001600160a01b031681565b61019960045481565b6101cf61027536600461132d565b6104e3565b600954600a54600b54600c546102909392919084565b60408051948552602085019390935291830152606082015260800161015c565b600354610178906001600160a01b031681565b6101cf6102d13660046112fd565b610534565b600f54610199565b61019960055481565b601054610199565b600954610199565b61019960075481565b60606002805461030f906114ea565b80601f016020809104026020016040519081016040528092919081815260200182805461033b906114ea565b80156103885780601f1061035d57610100808354040283529160200191610388565b820191906000526020600020905b81548152906001019060200180831161036b57829003601f168201915b5050505050905090565b600260005414156103be5760405162461bcd60e51b81526004016103b590611419565b60405180910390fd5b60026000556012546001600160a01b031633146104165760405162461bcd60e51b815260206004820152601660248201527511995cdd185ada5b99ce88139bdd08185b1b1bddd95960521b60448201526064016103b5565b6011819055600e54600354610443916001600160a01b0390811691163061043c600b5490565b600f610542565b50506001600055565b6000600260005414156104715760405162461bcd60e51b81526004016103b590611419565b6002600055600354600e546006546007546005546104a59433946001600160a01b039182169491169288926009600f610638565b600160005592915050565b60006104bd3384846106b5565b9392505050565b6001600160a01b0381166000908152600d60205260409020545b919050565b6000600260005414156105085760405162461bcd60e51b81526004016103b590611419565b6002600055600e5461052890849084906001600160a01b0316600f6106eb565b60016000559392505050565b6000336104bd8180856106b5565b60018101546040516370a0823160e01b81526001600160a01b03858116600483015260009283926105cf928a16906370a082319060240160206040518083038186803b15801561059157600080fd5b505afa1580156105a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105c99190611315565b90610826565b9050856001600160a01b0316876001600160a01b031614156105f8576105f58185610826565b90505b8061060757600191505061062f565b60018301546106169082610832565b600184015582546106279082610832565b835550600190505b95945050505050565b60008061064c8b8b8b8b8b8b8b8b8b61083e565b600285015490915061065e9082610826565b60028501556001600160a01b038b1660009081526004850160205260409020546106889082610826565b6001600160a01b038c16600090815260048601602052604090205550600190509998505050505050505050565b60006106e3848484600454600554600854600360009054906101000a90046001600160a01b03166009610974565b949350505050565b60008085116107475760405162461bcd60e51b815260206004820152602260248201527f46657374616b696e673a20726577617264206d75737420626520706f73697469604482015261766560f01b60648201526084016103b5565b848411156107d45760405162461bcd60e51b815260206004820152604e60248201527f46657374616b696e673a20776974686472617761626c6520616d6f756e74206d60448201527f757374206265206c657373207468616e206f7220657175616c20746f2074686560648201526d081c995dd85c9908185b5bdd5b9d60921b608482015260a4016103b5565b336107e08187866109fd565b60018401549096506107f29087610832565b600184015582546108039087610832565b835560028301546108149086610832565b60028401555060019050949350505050565b60006104bd82846114a7565b60006104bd8284611450565b600085804210156108615760405162461bcd60e51b81526004016103b59061139d565b87806108af5760405162461bcd60e51b815260206004820152601a60248201527f46657374616b696e673a206e6567617469766520616d6f756e7400000000000060448201526064016103b5565b33806108cd5760405162461bcd60e51b81526004016103b5906113e2565b6001600160a01b038d1660009081526004870160205260409020548a11156109375760405162461bcd60e51b815260206004820152601d60248201527f46657374616b696e673a206e6f7420656e6f7567682062616c616e636500000060448201526064016103b5565b874210156109565761094f8c8c8f8d8c8c8c8c610a0b565b9350610964565b61094f8c8c8f8d8a8a610b6b565b5050509998505050505050505050565b6000806109878a8a8a8a8a8a8a8a610c98565b60028401549091506109999082610832565b600284015582546109aa9082610832565b83556001600160a01b03891660009081526004840160205260409020546109d19082610832565b6001600160a01b038a166000908152600485016020526040902055506001905098975050505050505050565b60006106e384308585610e1d565b6000866001600160a01b038116610a345760405162461bcd60e51b81526004016103b5906113e2565b8354600090610a4d90610a478989610826565b90610e2b565b90506000610a7a82610a748b610a478960020154610a478d4261082690919063ffffffff16565b90610e37565b8554909150610a899082610826565b85556000610a988b8b8f610e43565b90506000610aa78c848f610e43565b9050818015610ab35750805b610af95760405162461bcd60e51b815260206004820152601760248201527646657374616b696e673a206572726f7220706179696e6760481b60448201526064016103b5565b8b6001600160a01b03168d6001600160a01b03168f6001600160a01b03167f0fd12da3890315fa38b862dc2fff7f24c95981f6508cc2be090640de791b671e8e87604051610b51929190918252602082015260400190565b60405180910390a450989c9b505050505050505050505050565b6000846001600160a01b038116610b945760405162461bcd60e51b81526004016103b5906113e2565b82546002850154600090610bac90610a74848a610e2b565b9050610bb88282610826565b85556000610bc789898d610e43565b90506000610bd68a848d610e43565b9050818015610be25750805b610c285760405162461bcd60e51b815260206004820152601760248201527646657374616b696e673a206572726f7220706179696e6760481b60448201526064016103b5565b896001600160a01b03168b6001600160a01b03168d6001600160a01b03167f0fd12da3890315fa38b862dc2fff7f24c95981f6508cc2be090640de791b671e8c87604051610c80929190918252602082015260400190565b60405180910390a450969a9950505050505050505050565b60008580421015610cbb5760405162461bcd60e51b81526004016103b59061139d565b85804210610cdb5760405162461bcd60e51b81526004016103b59061139d565b8880610d295760405162461bcd60e51b815260206004820152601a60248201527f46657374616b696e673a206e6567617469766520616d6f756e7400000000000060448201526064016103b5565b60028501548a908815801590610d475750610d448982610826565b82115b15610d5957610d568982610826565b91505b5060008111610daa5760405162461bcd60e51b815260206004820181905260248201527f46657374616b696e673a205374616b696e67206361702069732066696c6c656460448201526064016103b5565b610db58d82896109fd565b90508b6001600160a01b0316876001600160a01b03167f6c86f3fd5118b3aa8bb4f389a617046de0a3d3d477de1a1673d227f802f616dc8d84604051610e05929190918252602082015260400190565b60405180910390a39c9b505050505050505050505050565b600061062f82868686610e70565b60006104bd8284611488565b60006104bd8284611468565b600082610e52575060016104bd565b610e666001600160a01b0383168585611000565b5060019392505050565b6040516370a0823160e01b81526001600160a01b03838116600483015260009182918716906370a082319060240160206040518083038186803b158015610eb657600080fd5b505afa158015610eca573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610eee9190611315565b9050610f056001600160a01b038716868686611068565b6040516370a0823160e01b81526001600160a01b038581166004830152600091908816906370a082319060240160206040518083038186803b158015610f4a57600080fd5b505afa158015610f5e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f829190611315565b9050610f8e82826114a7565b925083831115610ff65760405162461bcd60e51b815260206004820152602d60248201527f53413a2061637475616c20616d6f756e74206c6172676572207468616e20747260448201526c185b9cd9995c88185b5bdd5b9d609a1b60648201526084016103b5565b5050949350505050565b6040516001600160a01b03831660248201526044810182905261106390849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b0319909316929092179091526110a6565b505050565b6040516001600160a01b03808516602483015283166044820152606481018290526110a09085906323b872dd60e01b9060840161102c565b50505050565b60006110fb826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166111789092919063ffffffff16565b805190915015611063578080602001905181019061111991906112dd565b6110635760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016103b5565b60606106e3848460008585843b6111d15760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016103b5565b600080866001600160a01b031685876040516111ed919061134e565b60006040518083038185875af1925050503d806000811461122a576040519150601f19603f3d011682016040523d82523d6000602084013e61122f565b606091505b509150915061123f82828661124a565b979650505050505050565b606083156112595750816104bd565b8251156112695782518084602001fd5b8160405162461bcd60e51b81526004016103b5919061136a565b80356001600160a01b03811681146104de57600080fd5b6000602082840312156112ab578081fd5b6104bd82611283565b600080604083850312156112c6578081fd5b6112cf83611283565b946020939093013593505050565b6000602082840312156112ee578081fd5b815180151581146104bd578182fd5b60006020828403121561130e578081fd5b5035919050565b600060208284031215611326578081fd5b5051919050565b6000806040838503121561133f578182fd5b50508035926020909101359150565b600082516113608184602087016114be565b9190910192915050565b60006020825282518060208401526113898160408501602087016114be565b601f01601f19169190910160400192915050565b60208082526025908201527f46657374616b696e673a206261642074696d696e6720666f72207468652072656040820152641c5d595cdd60da1b606082015260800190565b60208082526017908201527f46657374616b696e673a207a65726f2061646472657373000000000000000000604082015260600190565b6020808252601f908201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604082015260600190565b6000821982111561146357611463611525565b500190565b60008261148357634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156114a2576114a2611525565b500290565b6000828210156114b9576114b9611525565b500390565b60005b838110156114d95781810151838201526020016114c1565b838111156110a05750506000910152565b6002810460018216806114fe57607f821691505b6020821081141561151f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220f9db32f600011b0167b0b0388854d8d689914c5b613fcd413a401804db7bdbf864736f6c63430008020033";

export class FestakedWithReward__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name_: string,
    tokenAddress_: string,
    rewardTokenAddress_: string,
    stakingStarts_: BigNumberish,
    stakingEnds_: BigNumberish,
    withdrawStarts_: BigNumberish,
    withdrawEnds_: BigNumberish,
    stakingCap_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<FestakedWithReward> {
    return super.deploy(
      name_,
      tokenAddress_,
      rewardTokenAddress_,
      stakingStarts_,
      stakingEnds_,
      withdrawStarts_,
      withdrawEnds_,
      stakingCap_,
      overrides || {}
    ) as Promise<FestakedWithReward>;
  }
  getDeployTransaction(
    name_: string,
    tokenAddress_: string,
    rewardTokenAddress_: string,
    stakingStarts_: BigNumberish,
    stakingEnds_: BigNumberish,
    withdrawStarts_: BigNumberish,
    withdrawEnds_: BigNumberish,
    stakingCap_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      name_,
      tokenAddress_,
      rewardTokenAddress_,
      stakingStarts_,
      stakingEnds_,
      withdrawStarts_,
      withdrawEnds_,
      stakingCap_,
      overrides || {}
    );
  }
  attach(address: string): FestakedWithReward {
    return super.attach(address) as FestakedWithReward;
  }
  connect(signer: Signer): FestakedWithReward__factory {
    return super.connect(signer) as FestakedWithReward__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FestakedWithRewardInterface {
    return new utils.Interface(_abi) as FestakedWithRewardInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FestakedWithReward {
    return new Contract(address, _abi, signerOrProvider) as FestakedWithReward;
  }
}