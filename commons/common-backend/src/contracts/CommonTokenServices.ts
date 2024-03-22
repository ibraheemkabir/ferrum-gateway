import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable } from "ferrum-plumbing";
import { CurrencyListSvc } from "../CurrencyListSvc";
import { TokenDetails, UserContractAllocation, ChainLogos } from "types";
import { CustomTransactionCallRequest } from "unifyre-extension-sdk";

export class CommonTokenServices implements Injectable {
	constructor(
		private helper: EthereumSmartContractHelper,
		private tokenListSvc: CurrencyListSvc) {}
	__name__() { return 'CommonTokenServices'; }

	async allocation(userAddress: string, contractAddress: string, currency: string):
	Promise<UserContractAllocation> {
		const allocation = await this.helper.currentAllowance(currency, userAddress, contractAddress);
		const [network, _] = EthereumSmartContractHelper.parseCurrency(currency)
		return {
			allocation: await this.helper.amountToHuman(currency, allocation.toFixed()),
			contractAddress,
			userAddress,
			currency,
			expirySeconds: 0,
			method: '',
			network,
		};
	}

	async approveGetTransaction(userAddress: string,
		contractAddress: string,
		currency: string,
		amount: string):
	Promise<CustomTransactionCallRequest[]> {
		console.log('ABOUT TO APPROVE ', {currency, userAddress, amount, contractAddress})
		const [nonce, tx] = !amount ? await this.helper.approveMaxRequests(
			currency, userAddress,
			amount, contractAddress, 'the given contract')
		: await this.helper.approveRequests(
			currency, userAddress,
			amount, contractAddress, 'the given contract')

		return tx;
	}

	async tokenList(): Promise<TokenDetails[]> {
		return this.tokenListSvc.mergedList();
	}

	async chainLogos(): Promise<{[n: string]: ChainLogos}> {
		return this.tokenListSvc.chainLogos();
	}
}