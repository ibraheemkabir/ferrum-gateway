import { Big } from 'big.js';

export interface GasParameters {
  gasLimit: string;
  gasPrice: string;
}

export type Web3ProviderConfig = { [network: string]: string };
export class ParseBigError extends Error { }

export interface CustomTransactionCallRequest {
  from: string;
  currency: string;
  contract: string;
  amount: string;
  data: string;
  gas: GasParameters;
  nonce?: number;
  description?: string;
  value?: string;
}

export interface StakingContracts {
	router: string;
	openEnded: string;
	timed: string;
	factory: string;
	address?:string;
}

export interface CrucibleContracts {
	router: string;
	factory: string;
	staking: string;
}

export interface NetworkedConfig<T> {
    [network: string]: T;
  }

export interface CrucibleConfig {
	contracts: NetworkedConfig<CrucibleContracts>;
	stakingContracts: NetworkedConfig<StakingContracts[]>;
}


export interface SendMoneyResponse {
  transactionId: string;
  requestPayload?: string;
}

export interface CustomTransactionCallResponse {
  requestId: string;
  rejected: boolean;
  response: SendMoneyResponse[];
  requestPayload?: any;
  reason?: string;
}

export interface SignedRawDataResponse {
  signature: { r: string, s: string, v: number};
  publicKeyHex: string;
}

export class BigUtils {
	static truthy(b?: Big): boolean {
		return !!b && !(new Big(0).eq(b));
	}

	static safeParse(s: string): Big {
		try {
			return new Big(s);
		} catch (e) {
			return new Big('0');
		}
	}

	static parseOrThrow(s: string, varName: string): Big {
		try {
			return new Big(s);
		} catch (e) {
			throw new ParseBigError(`Error parsing ${varName}. "${s}" is not a valid number`);
		}
	}
}


export type SignedMessageResponse = SignedRawDataResponse | SendMoneyResponse | SendMoneyResponse[];