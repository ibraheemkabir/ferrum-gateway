/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BasicLocker, BasicLockerInterface } from "../BasicLocker";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "getLockType",
    outputs: [
      {
        internalType: "enum LockLib.LockType",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "enum LockLib.LockType",
        name: "lockType",
        type: "uint8",
      },
      {
        internalType: "uint16",
        name: "penaltyRateOver1000",
        type: "uint16",
      },
      {
        internalType: "bool",
        name: "permanent",
        type: "bool",
      },
    ],
    name: "lockAddress",
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
        name: "source",
        type: "address",
      },
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
    ],
    name: "lockOrGetPenalty",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "addresses",
        type: "address[]",
      },
    ],
    name: "multiBlackList",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "addresses",
        type: "address[]",
      },
    ],
    name: "multiWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "safetyLocker",
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
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_safetyLocker",
        type: "address",
      },
    ],
    name: "setSafetyLocker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610f258061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80639190031b116100715780639190031b1461011f578063aa61a9dd14610142578063b1ea33091461016c578063d4e390971461017f578063f2fde38b146101a1578063fc0c546a146101b4576100a9565b80633aa9b7b6146100ae5780634b3eac9a146100c3578063715018a6146100f35780638719e226146100fb5780638da5cb5b1461010e575b600080fd5b6100c16100bc366004610d2a565b6101c7565b005b6002546100d6906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b6100c161032e565b6100c1610109366004610dbe565b610364565b6000546001600160a01b03166100d6565b61013261012d366004610d5c565b6104b3565b60405190151581526020016100ea565b610155610150366004610d2a565b61064a565b6040805192151583526020830191909152016100ea565b6100c161017a366004610dbe565b61098d565b61019261018d366004610d09565b610b54565b6040516100ea93929190610e49565b6100c16101af366004610d09565b610c02565b6003546100d6906001600160a01b031681565b6000546001600160a01b031633146101fa5760405162461bcd60e51b81526004016101f190610e85565b60405180910390fd5b6001600160a01b0382166102445760405162461bcd60e51b81526020600482015260116024820152702637b1b5b2b91d102130b2103a37b5b2b760791b60448201526064016101f1565b600380546001600160a01b038085166001600160a01b0319928316179092556002805484841692169190911790819055161561032a57806001600160a01b0316638f3037ef6040518163ffffffff1660e01b815260040160206040518083038186803b1580156102b357600080fd5b505afa1580156102c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102eb9190610e2d565b61032a5760405162461bcd60e51b815260206004820152601060248201526f2130b21039b0b332ba3ca637b1b5b2b960811b60448201526064016101f1565b5050565b6000546001600160a01b031633146103585760405162461bcd60e51b81526004016101f190610e85565b6103626000610c9d565b565b3360009081526001602052604090205460ff16600a818181111561039857634e487b7160e01b600052602160045260246000fd5b14806103c35750600881600a8111156103c157634e487b7160e01b600052602160045260246000fd5b145b61040f5760405162461bcd60e51b815260206004820152601f60248201527f4c6f636b65723a204f6e6c792063616c6c2066726f6d20424c2061646d696e0060448201526064016101f1565b60005b828110156104ad5760046001600086868581811061044057634e487b7160e01b600052603260045260246000fd5b90506020020160208101906104559190610d09565b6001600160a01b031681526020810191909152604001600020805460ff1916600183600a81111561049657634e487b7160e01b600052602160045260246000fd5b0217905550806104a581610eba565b915050610412565b50505050565b600080546001600160a01b031633146104de5760405162461bcd60e51b81526004016101f190610e85565b6001600160a01b0385166105345760405162461bcd60e51b815260206004820152601e60248201527f4c6f636b65723a20696e76616c6964207461726765742061646472657373000060448201526064016101f1565b6001600160a01b0385166000908152600160205260409020546301000000900460ff16156105ae5760405162461bcd60e51b815260206004820152602160248201527f4c6f636b65723a2061646472657373206c6f636b206973207065726d616e656e6044820152601d60fa1b60648201526084016101f1565b6001600160a01b03851660009081526001602081905260409091208054869260ff199091169083600a8111156105f457634e487b7160e01b600052602160045260246000fd5b0217905550506001600160a01b0384166000908152600160208190526040909120805483151563010000000263ff0000001961ffff87166101000262ffff00199093169290921791909116179055949350505050565b6001600160a01b0382166000908152600160205260408082208151606081019092528054839283929091829060ff16600a81111561069857634e487b7160e01b600052602160045260246000fd5b600a8111156106b757634e487b7160e01b600052602160045260246000fd5b81529054610100810461ffff16602080840191909152630100000090910460ff90811615156040938401526001600160a01b0388166000908152600190925282822083516060810190945280549495509193839116600a81111561072b57634e487b7160e01b600052602160045260246000fd5b600a81111561074a57634e487b7160e01b600052602160045260246000fd5b81529054610100810461ffff1660208301526301000000900460ff161515604090910152905060038251600a81111561079357634e487b7160e01b600052602160045260246000fd5b141580156107c2575060048251600a8111156107bf57634e487b7160e01b600052602160045260246000fd5b14155b61080e5760405162461bcd60e51b815260206004820152601a60248201527f4c6f636b65723a206e6f7420616c6c6f77656420736f7572636500000000000060448201526064016101f1565b60028151600a81111561083157634e487b7160e01b600052602160045260246000fd5b14158015610860575060048151600a81111561085d57634e487b7160e01b600052602160045260246000fd5b14155b6108ac5760405162461bcd60e51b815260206004820152601f60248201527f4c6f636b65723a206e6f7420616c6c6f7765642064657374696e6174696f6e0060448201526064016101f1565b6002546001600160a01b03161561097f576003546001600160a01b031633146109175760405162461bcd60e51b815260206004820152601a60248201527f4c6f636b65723a206e6f7420616c6c6f7765642063616c6c657200000000000060448201526064016101f1565b60025460405163f867a90760e01b81526001600160a01b03888116600483015287811660248301529091169063f867a90790604401600060405180830381600087803b15801561096657600080fd5b505af115801561097a573d6000803e3d6000fd5b505050505b506000958695509350505050565b3360009081526001602052604090205460ff16600a81818111156109c157634e487b7160e01b600052602160045260246000fd5b14806109ec5750600881600a8111156109ea57634e487b7160e01b600052602160045260246000fd5b145b610a385760405162461bcd60e51b815260206004820152601f60248201527f4c6f636b65723a204f6e6c792063616c6c2066726f6d20424c2061646d696e0060448201526064016101f1565b60005b828110156104ad57600460016000868685818110610a6957634e487b7160e01b600052603260045260246000fd5b9050602002016020810190610a7e9190610d09565b6001600160a01b0316815260208101919091526040016000205460ff16600a811115610aba57634e487b7160e01b600052602160045260246000fd5b1415610b4257600060016000868685818110610ae657634e487b7160e01b600052603260045260246000fd5b9050602002016020810190610afb9190610d09565b6001600160a01b031681526020810191909152604001600020805460ff1916600183600a811115610b3c57634e487b7160e01b600052602160045260246000fd5b02179055505b80610b4c81610eba565b915050610a3b565b6001600160a01b0381166000908152600160205260408082208151606081019092528054839283928392829060ff16600a811115610ba257634e487b7160e01b600052602160045260246000fd5b600a811115610bc157634e487b7160e01b600052602160045260246000fd5b81529054610100810461ffff16602080840191909152630100000090910460ff16151560409283015282519083015192909101519097919650945092505050565b6000546001600160a01b03163314610c2c5760405162461bcd60e51b81526004016101f190610e85565b6001600160a01b038116610c915760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016101f1565b610c9a81610c9d565b50565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b80356001600160a01b0381168114610d0457600080fd5b919050565b600060208284031215610d1a578081fd5b610d2382610ced565b9392505050565b60008060408385031215610d3c578081fd5b610d4583610ced565b9150610d5360208401610ced565b90509250929050565b60008060008060808587031215610d71578182fd5b610d7a85610ced565b93506020850135600b8110610d8d578283fd5b9250604085013561ffff81168114610da3578283fd5b91506060850135610db381610ee1565b939692955090935050565b60008060208385031215610dd0578182fd5b823567ffffffffffffffff80821115610de7578384fd5b818501915085601f830112610dfa578384fd5b813581811115610e08578485fd5b8660208083028501011115610e1b578485fd5b60209290920196919550909350505050565b600060208284031215610e3e578081fd5b8151610d2381610ee1565b60608101600b8510610e6b57634e487b7160e01b600052602160045260246000fd5b93815261ffff929092166020830152151560409091015290565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6000600019821415610eda57634e487b7160e01b81526011600452602481fd5b5060010190565b8015158114610c9a57600080fdfea264697066735822122000684c5ca4d6a22612f8e2a39a304e5345f4c6561d407adf61203e7395746e8364736f6c63430008020033";

export class BasicLocker__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BasicLocker> {
    return super.deploy(overrides || {}) as Promise<BasicLocker>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BasicLocker {
    return super.attach(address) as BasicLocker;
  }
  connect(signer: Signer): BasicLocker__factory {
    return super.connect(signer) as BasicLocker__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BasicLockerInterface {
    return new utils.Interface(_abi) as BasicLockerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BasicLocker {
    return new Contract(address, _abi, signerOrProvider) as BasicLocker;
  }
}