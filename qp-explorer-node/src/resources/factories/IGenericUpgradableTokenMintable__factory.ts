/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IGenericUpgradableTokenMintable,
  IGenericUpgradableTokenMintableInterface,
} from "../IGenericUpgradableTokenMintable";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newTotalSupply",
        type: "uint256",
      },
    ],
    name: "updateTotalSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IGenericUpgradableTokenMintable__factory {
  static readonly abi = _abi;
  static createInterface(): IGenericUpgradableTokenMintableInterface {
    return new utils.Interface(
      _abi
    ) as IGenericUpgradableTokenMintableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IGenericUpgradableTokenMintable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IGenericUpgradableTokenMintable;
  }
}