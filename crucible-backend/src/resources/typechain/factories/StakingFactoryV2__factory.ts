/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  StakingFactoryV2,
  StakingFactoryV2Interface,
} from "../StakingFactoryV2";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "stakingPoolAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "stakingPoolId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "stakingPoolAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "stakingPoolId",
        type: "address",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    name: "createPool",
    outputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "getPool",
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
    name: "parameters",
    outputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "stakingPoolAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "stakingPoolId",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5030606081901b608052611b8161003260003960006104af0152611b816000f3fe60806040523480156200001157600080fd5b5060043610620000465760003560e01c8063531aa03e146200004b57806389035730146200007a578063f1935fac1462000097575b600080fd5b620000626200005c36600462000753565b620000ae565b60405162000071919062000923565b60405180910390f35b62000084620000d4565b6040516200007195949392919062000951565b62000062620000a83660046200078a565b62000221565b60056020908152600092835260408084209091529082529020546001600160a01b031681565b60008054600154600254600380546001600160a01b0394851695938516949092169291620001029062000ad7565b80601f0160208091040260200160405190810160405280929190818152602001828054620001309062000ad7565b8015620001815780601f10620001555761010080835404028352916020019162000181565b820191906000526020600020905b8154815290600101906020018083116200016357829003601f168201915b505050505090806004018054620001989062000ad7565b80601f0160208091040260200160405190810160405280929190818152602001828054620001c69062000ad7565b8015620002175780601f10620001eb5761010080835404028352916020019162000217565b820191906000526020600020905b815481529060010190602001808311620001f957829003601f168201915b5050505050905085565b60006200022d620004a4565b6040517f019848920000000000000000000000000000000000000000000000000000000081526000906001600160a01b038616906301984892906200027790879060040162000923565b600060405180830381600087803b1580156200029257600080fd5b505af1158015620002a7573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052620002d191908101906200085b565b9050805160001415620003015760405162461bcd60e51b8152600401620002f890620009de565b60405180910390fd5b8251620003225760405162461bcd60e51b8152600401620002f89062000a15565b6040517fcabeb6250000000000000000000000000000000000000000000000000000000081526001600160a01b0386169063cabeb625906200036990879060040162000923565b60206040518083038186803b1580156200038257600080fd5b505afa15801562000397573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003bd919062000832565b620003dc5760405162461bcd60e51b8152600401620002f890620009a7565b620003eb3086868487620004dc565b6001600160a01b038681166000908152600560209081526040808320898516845290915290819020805473ffffffffffffffffffffffffffffffffffffffff191692841692909217909155519092506200044790849062000905565b6040518091039020846001600160a01b0316866001600160a01b03167fdee8a26fa123dd6b383ce05b0105c8c99ff522876e26722f016589a69ba802a78560405162000494919062000923565b60405180910390a4509392505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614620004da57600080fd5b565b6040805160a0810182526001600160a01b03808816808352878216602080850182905292881694840185905260608401879052608084018690526000805473ffffffffffffffffffffffffffffffffffffffff1990811690931781556001805484169092179091556002805490921690941790558451839162000565916003918801906200063d565b5060808201518051620005839160048401916020909101906200063d565b50506040516200059b91508690869060200162000937565b60405160208183030381529060405280519060200120604051620005bf90620006cc565b8190604051809103906000f5905080158015620005e0573d6000803e3d6000fd5b506000805473ffffffffffffffffffffffffffffffffffffffff19908116825560018054821690556002805490911690559091508062000622600382620006da565b62000632600483016000620006da565b505095945050505050565b8280546200064b9062000ad7565b90600052602060002090601f0160209004810192826200066f5760008555620006ba565b82601f106200068a57805160ff1916838001178555620006ba565b82800160010185558215620006ba579182015b82811115620006ba5782518255916020019190600101906200069d565b50620006c89291506200071f565b5090565b610fef8062000b5d83390190565b508054620006e89062000ad7565b6000825580601f10620006fc57506200071c565b601f0160209004906000526020600020908101906200071c91906200071f565b50565b5b80821115620006c8576000815560010162000720565b80356001600160a01b03811681146200074e57600080fd5b919050565b6000806040838503121562000766578182fd5b620007718362000736565b9150620007816020840162000736565b90509250929050565b6000806000606084860312156200079f578081fd5b620007aa8462000736565b9250620007ba6020850162000736565b9150604084013567ffffffffffffffff811115620007d6578182fd5b8401601f81018613620007e7578182fd5b8035620007fe620007f88262000a79565b62000a4c565b81815287602083850101111562000813578384fd5b8160208401602083013783602083830101528093505050509250925092565b60006020828403121562000844578081fd5b8151801515811462000854578182fd5b9392505050565b6000602082840312156200086d578081fd5b815167ffffffffffffffff81111562000884578182fd5b8201601f8101841362000895578182fd5b8051620008a6620007f88262000a79565b818152856020838501011115620008bb578384fd5b620008ce82602083016020860162000aa4565b95945050505050565b60008151808452620008f181602086016020860162000aa4565b601f01601f19169290920160200192915050565b600082516200091981846020870162000aa4565b9190910192915050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b60006001600160a01b038088168352808716602084015280861660408401525060a060608301526200098760a0830185620008d7565b82810360808401526200099b8185620008d7565b98975050505050505050565b6020808252601a908201527f534656323a20506f6f6c206e6f7420746f6b656e697a61626c65000000000000604082015260600190565b60208082526017908201527f534656323a205374616b696e67206e6f7420666f756e64000000000000000000604082015260600190565b60208082526018908201527f534656323a2053796d626f6c2069732072657175697265640000000000000000604082015260600190565b60405181810167ffffffffffffffff8111828210171562000a715762000a7162000b2d565b604052919050565b600067ffffffffffffffff82111562000a965762000a9662000b2d565b50601f01601f191660200190565b60005b8381101562000ac157818101518382015260200162000aa7565b8381111562000ad1576000848401525b50505050565b60028104600182168062000aec57607f821691505b6020821081141562000b27577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfe60c06040523480156200001157600080fd5b50600080336001600160a01b031663890357306040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156200005157600080fd5b505af115801562000066573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405262000090919081019062000320565b8051600190600090620000ab906002906020860190620001b2565b50508251620000c091906020850190620001b2565b505050606092831b6001600160601b03199081166080529282901b90921660a052600080546001600160a01b0319166001600160a01b038085169190911790915560405163cabeb62560e01b81529194509192509083169063cabeb625906200012e908490600401620003e9565b60206040518083038186803b1580156200014757600080fd5b505afa1580156200015c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001829190620003c0565b620001aa5760405162461bcd60e51b8152600401620001a190620003fd565b60405180910390fd5b505062000487565b828054620001c09062000434565b90600052602060002090601f016020900481019282620001e457600085556200022f565b82601f10620001ff57805160ff19168380011785556200022f565b828001600101855582156200022f579182015b828111156200022f57825182559160200191906001019062000212565b506200023d92915062000241565b5090565b5b808211156200023d576000815560010162000242565b80516001600160a01b03811681146200027057600080fd5b919050565b600082601f83011262000286578081fd5b81516001600160401b0380821115620002a357620002a362000471565b6040516020601f8401601f1916820181018381118382101715620002cb57620002cb62000471565b6040528382528584018101871015620002e2578485fd5b8492505b83831015620003055785830181015182840182015291820191620002e6565b838311156200031657848185840101525b5095945050505050565b600080600080600060a0868803121562000338578081fd5b620003438662000258565b9450620003536020870162000258565b9350620003636040870162000258565b60608701519093506001600160401b038082111562000380578283fd5b6200038e89838a0162000275565b93506080880151915080821115620003a4578283fd5b50620003b38882890162000275565b9150509295509295909350565b600060208284031215620003d2578081fd5b81518015158114620003e2578182fd5b9392505050565b6001600160a01b0391909116815260200190565b6020808252601c908201527f5354503a20706f6f6c206973206e6f7420746f6b656e697a61626c6500000000604082015260600190565b6002810460018216806200044957607f821691505b602082108114156200046b57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b60805160601c60a05160601c610b12620004dd6000396000818161027c015281816103d401528181610496015281816105330152818161058e01528181610671015261077d015260006107270152610b126000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c806370a0823111610081578063a9059cbb1161005b578063a9059cbb1461018c578063c45a01551461019f578063dd62ed3e146101a7576100d4565b806370a082311461016957806395d89b411461017c578063a46c850514610184576100d4565b806323b872dd116100b257806323b872dd1461012c57806325b15a0c1461013f578063313ce56714610154576100d4565b806306fdde03146100d9578063095ea7b3146100f757806318160ddd14610117575b600080fd5b6100e16101ba565b6040516100ee91906109c9565b60405180910390f35b61010a6101053660046108af565b610248565b6040516100ee91906109be565b61011f6103a0565b6040516100ee9190610a71565b61010a61013a366004610874565b610462565b610147610531565b6040516100ee9190610910565b61015c610555565b6040516100ee9190610a7a565b61011f610177366004610828565b61055a565b6100e1610621565b61014761062e565b61010a61019a3660046108af565b61063d565b610147610725565b61011f6101b5366004610842565b610749565b600180546101c790610a88565b80601f01602080910402602001604051908101604052809291908181526020018280546101f390610a88565b80156102405780601f1061021557610100808354040283529160200191610240565b820191906000526020600020905b81548152906001019060200180831161022357829003601f168201915b505050505081565b600080546040517f8068dc330000000000000000000000000000000000000000000000000000000081526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000811692638068dc33926102bb929190911690339088908890600401610994565b602060405180830381600087803b1580156102d557600080fd5b505af11580156102e9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061030d91906108d8565b61034c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161034390610a3a565b60405180910390fd5b826001600160a01b0316336001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161038f9190610a71565b60405180910390a350600192915050565b600080546040517f602172670000000000000000000000000000000000000000000000000000000081526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263602172679261040d929190911690600401610910565b60206040518083038186803b15801561042557600080fd5b505afa158015610439573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061045d91906108f8565b905090565b600080546040517f22f187d80000000000000000000000000000000000000000000000000000000081526001600160a01b037f00000000000000000000000000000000000000000000000000000000000000008116926322f187d8926104d79291909116903390899089908990600401610961565b602060405180830381600087803b1580156104f157600080fd5b505af1158015610505573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061052991906108d8565b949350505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b601281565b600080546040517fce4cb8760000000000000000000000000000000000000000000000000000000081526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263ce4cb876926105c99291909116908690600401610924565b60206040518083038186803b1580156105e157600080fd5b505afa1580156105f5573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061061991906108f8565b90505b919050565b600280546101c790610a88565b6000546001600160a01b031681565b600080546040517ff52f9b9f0000000000000000000000000000000000000000000000000000000081526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263f52f9b9f926106b0929190911690339088908890600401610994565b600060405180830381600087803b1580156106ca57600080fd5b505af11580156106de573d6000803e3d6000fd5b50505050826001600160a01b0316336001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161038f9190610a71565b7f000000000000000000000000000000000000000000000000000000000000000081565b600080546040517f927da1050000000000000000000000000000000000000000000000000000000081526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169263927da105926107ba9291909116908790879060040161093e565b60206040518083038186803b1580156107d257600080fd5b505afa1580156107e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061080a91906108f8565b9392505050565b80356001600160a01b038116811461061c57600080fd5b600060208284031215610839578081fd5b61080a82610811565b60008060408385031215610854578081fd5b61085d83610811565b915061086b60208401610811565b90509250929050565b600080600060608486031215610888578081fd5b61089184610811565b925061089f60208501610811565b9150604084013590509250925092565b600080604083850312156108c1578182fd5b6108ca83610811565b946020939093013593505050565b6000602082840312156108e9578081fd5b8151801515811461080a578182fd5b600060208284031215610909578081fd5b5051919050565b6001600160a01b0391909116815260200190565b6001600160a01b0392831681529116602082015260400190565b6001600160a01b0393841681529183166020830152909116604082015260600190565b6001600160a01b039586168152938516602085015291841660408401529092166060820152608081019190915260a00190565b6001600160a01b039485168152928416602084015292166040820152606081019190915260800190565b901515815260200190565b6000602080835283518082850152825b818110156109f5578581018301518582016040015282016109d9565b81811115610a065783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60208082526013908201527f5354503a20617070726f7665206661696c656400000000000000000000000000604082015260600190565b90815260200190565b60ff91909116815260200190565b600281046001821680610a9c57607f821691505b60208210811415610ad6577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fea26469706673582212208e736c866c4f19258ae94ff382acb8cac6bb6723c4c19d2d9c202f80328fcb6664736f6c63430008000033a26469706673582212208c55897b7983a4d20f87d83feee26dac66a4078a0555b60c7f50f77550fa16ba64736f6c63430008000033";

export class StakingFactoryV2__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<StakingFactoryV2> {
    return super.deploy(overrides || {}) as Promise<StakingFactoryV2>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): StakingFactoryV2 {
    return super.attach(address) as StakingFactoryV2;
  }
  connect(signer: Signer): StakingFactoryV2__factory {
    return super.connect(signer) as StakingFactoryV2__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): StakingFactoryV2Interface {
    return new utils.Interface(_abi) as StakingFactoryV2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): StakingFactoryV2 {
    return new Contract(address, _abi, signerOrProvider) as StakingFactoryV2;
  }
}