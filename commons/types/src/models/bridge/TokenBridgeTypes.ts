import { Connection, Document, Schema } from "mongoose";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";
import { ValidationUtils } from "ferrum-plumbing";
import {
  DomainSeparator,
  Eip712TypeDefinition,
} from "unifyre-extension-web3-retrofit/dist/client/Eip712";
import { MultiSigSignature, TransactionTrackable } from "../chain/ChainTypes";
import { Networks } from 'ferrum-plumbing';

// TODO: Remove mongoose types out of this repo

export interface RequestMayNeedApprove {
  isApprove: boolean;
  requests: CustomTransactionCallRequest[];
}

export const PairedAddressType: Eip712TypeDefinition = {
  Pair: [
    { name: "network1", type: "string" },
    { name: "address1", type: "address" },
    { name: "network2", type: "string" },
    { name: "address2", type: "address" },
  ],
};

export interface liquidityNotificationConfig{
  projectAdminEmail: string,
  currency: string,
  listenerUrl: string,
  upperthreshold: number,
  lowerthreshold: number,
  lastNotifiedTime: number
}


export interface PairedAddress {
  network1: string;
  address1: string;
  network2: string;
  address2: string;
}

export interface SignedPairAddress {
  pair: PairedAddress;
  signature1: string;
  signature2: string;
}

export const TOKEN_BRIDGE_DOMAIN_SALT =
  "0xebb7c67ee709a29f4d80f3ac6db9cd0e84fccb20437963314b825afc2463825c";

export interface PayBySignatureData {
  token: string;
  payee: string;
  amount: string;
  toToken: string;
  sourceChainId: number;
  swapTxId: string;
  contractName: string;
  contractVersion: string;
  contractAddress: string;
  hash: string;
  signatures: MultiSigSignature[];

  signature: string; // For backward compatibility
  salt: string; // For backward compatibility
}

// Every transaction sent by user using a paired address to the bridge contract,
// will produced a Withdrawable Balance Item
export interface UserBridgeWithdrawableBalanceItem {
  version: string; // The schema version
  v: number;  // The optimistic locking v
  id: string; // DEPRECATED. do not use anymore
  timestamp: number;
  receiveNetwork: string;
  receiveCurrency: string;
  receiveTransactionId: string;
  receiveTransactionTimestamp: number;
  receiveAddress: string;
  receiveAmount: string;

  sendNetwork: string;
  sendAddress: string;
  sendTimestamp: number;
  sendCurrency: string;
  sendAmount: string; //
  payBySig: PayBySignatureData;
  originCurrency: string;
  sendToCurrency: string;

	// TODO: Refactor and use the transaction trackeble
  used: "" | "pending" | "failed" | "completed";
  useTransactions: { id: string; status: string; timestamp: number }[];
	execution: TransactionTrackable;
  signatures: number; // No of signatures
  creator: string;
  blocked: boolean;
}

export interface UserBridgeLiquidityItem {
  network: string;
  address: string;
  currency: string;
  liquidity: string;
}

export interface WithdrawItemHashVerification {
  signer: string;
  network: string;
  transactionId: string;
  hash: string;
  signature: string;
  signatureCreationTime: number;
}

// TODO: Remove schemas out of types repo. Types repo should not depend on mongoose
const transactionTrackableSchema = new Schema<TransactionTrackable & Document>({
  status: String,
  transactions: [{
    network: String,
    transactionId: String,
    timestamp: Number,
    status: String,
    message: String,
  }]
});

const signatureSchema = new Schema<MultiSigSignature & Document>({
  creationTime: Number,
  creator: String,
  signature: String,
});

const payBySignatureDataSchema = new Schema<PayBySignatureData & Document>({
  token: String,
  payee: String,
  amount: String,
  toToken: String,
  sourceChainId: Number,
  swapTxId: String,
  contractName: String,
  contractVersion: String,
  contractAddress: String,
  hash: String,
  signatures: [signatureSchema],

  // Bacward compatibility - TODO: deprecated. Remove with caution
  signature: String,
  salt: String,
});

///@ts-ignore
const liquidityNotificationConfigSchema: Schema = new Schema<
liquidityNotificationConfig & Document
>({
projectAdminEmail: String,
currency: String,
listenerUrl: String,
upperthreshold: Number,
lowerthreshold: Number,
lastNotifiedTime: Number
}) 

//@ts-ignore
const userBridgeWithdrawableBalanceItemSchema: Schema = new Schema<
  UserBridgeWithdrawableBalanceItem & Document
>({
  version: String,
  v: Number,
  id: String, // same as signedWithdrawHash
  timestamp: Number,
  receiveNetwork: String,
  receiveCurrency: String,
  receiveAddress: String,
  receiveAmount: String,
  receiveTransactionId: String,
  receiveTransactionTimestamp: Number,
  signatures: Number,
  creator: String,

  sendNetwork: String,
  sendAddress: String,
  sendTimestamp: Number,
  sendCurrency: String,
  sendAmount: String,

  payBySig: payBySignatureDataSchema,

  originCurrency: String,
  sendToCurrency: String,

  used: String,
  useTransactions: [{ id: String, status: String, timestamp: Number }],
	execution: transactionTrackableSchema,
  blocked: Boolean,
});

//@ts-ignore
const SignedPairAddressSchema: Schema = new Schema<
  SignedPairAddress & Document
>({
  pair: new Schema<PairedAddress & Document>({
    network1: String,
    address1: String,
    network2: String,
    address2: String,
  }),
  signature1: String,
  signature2: String,
});

export function getEnv(env: string) {
  const res = process.env[env];
  ValidationUtils.isTrue(
    !!res,
    `Make sure to set environment variable '${env}'`
  );
  return res!;
}

export interface SwapTx {
  id: string;
  network: string;
  status: "pending" | "processed" | "failed";
	reason?: string;
}

const swapTxSchema = new Schema<SwapTx & Document>({
  id: String,
  network: String,
  status: String,
	reason: String,
})

export const SwapTxModel = (c: Connection) =>
  c.model<SwapTx & Document>(
    "swapTransactions",
    swapTxSchema
  )

export const liquidityNotificationConfigModel = (c: Connection) =>
  c.model<liquidityNotificationConfig & Document>(
    "liquidityNotificationConfig",
    liquidityNotificationConfigSchema
);


export const UserBridgeWithdrawableBalanceItemModel = (c: Connection) =>
  c.model<UserBridgeWithdrawableBalanceItem & Document>(
    "userBridgeWithdrawableBalanceItem",
    userBridgeWithdrawableBalanceItemSchema
  );

export const SignedPairAddressSchemaModel = (c: Connection) =>
  c.model<SignedPairAddress & Document>(
    "signedPairAddress",
    SignedPairAddressSchema
  );

// TODO: Remove
export function domainSeparator(network: string): DomainSeparator {
  const chainId = Networks.for(network).chainId;
  return {
    chainId: chainId.toString(),
    name: "PairedUnifyreWallet",
    verifyingContract: '', //BRIDGE_CONTRACT[network],
    version: "0.1.0",
  };
}

export interface PairedAddress {
  network1: string;
  address1: string;
  network2: string;
  address2: string;
}

// Balance related types

export interface UserBridgeLiquidityItem {
  network: string;
  address: string;
  currency: string;
  liquidity: string;
}

export interface BridgeTokenConfig {
  sourceNetwork: string;
  targetNetwork: string;
  sourceCurrency: string;
  targetCurrency: string;
  feeConstant: string;
  fee: string;
}

export interface NetworkedConfig<T> {
  [network: string]: T;
}

export interface NetworkRelatedConfig {
  [network: string]: string;
}
