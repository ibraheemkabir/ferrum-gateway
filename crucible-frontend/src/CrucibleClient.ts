import { JsonRpcRequest, ValidationUtils, Network } from 'ferrum-plumbing';
import { ApiClient } from "common-containers";
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { addAction, CommonActions } from './common/CommonActions';
import { CrucibleInfo, CRUCIBLE_CONTRACTS_V_0_1, Utils } from 'types';

export const CrucibleClientActions = {
	CRUCIBLES_LOADED: 'CRUCIBLES_LOADED',
	CRUCIBLE_LOADED: 'CRUCIBLE_LOADED',
	USER_CRUCIBLE_LOADED: 'USER_CRUCIBLE_LOADED',
	SELECT_CRUCIBLE: 'SELECT_CRUCIBLE',
};

const Actions = CrucibleClientActions;

export class CrucibleClient {
	constructor(private api: ApiClient) { }

	__name__() { return 'CrucibleClient'; }

	async getCrucible(dispatch: Dispatch<AnyAction>, crucibleCurrency: string) {
		const [network, address] = Utils.parseCurrency(crucibleCurrency);
		const crucible = await this.updateCrucible(dispatch, network, address);
		dispatch(addAction(Actions.SELECT_CRUCIBLE, {crucible}));
	}

	async getUserCrucibleInfo(dispatch: Dispatch<AnyAction>,
		crucible: string) {
		const userCrucibleInfo = await this.api.api({
			command: 'getUserCrucibleInfo',
			data: {crucible, userAddress: this.api.getAddress()},
			params: [],
		} as JsonRpcRequest);
		if (!!userCrucibleInfo) {
			dispatch(addAction(Actions.USER_CRUCIBLE_LOADED, {userCrucibleInfo}));
		}
		return userCrucibleInfo;
	}

	async getAllCrucibles(dispatch: Dispatch<AnyAction>, network: string) {
		const cs = await this.getAllCruciblesFromDb(dispatch, network);
		for(const c of cs) {
			this.updateCrucible(dispatch, network, c.contractAddress);
		}
	}

	async updateCrucible(dispatch: Dispatch<AnyAction>, network: string, contractAddress: string) {
		const crucible = await this.api.api({
			command: 'getCrucible',
			data: {crucible: `${network}:${contractAddress.toLowerCase()}`},
			params: [],
		} as JsonRpcRequest);
		if (!!crucible) {
			dispatch(addAction(Actions.CRUCIBLE_LOADED, {crucible}));
		}
		return crucible;
	}

	async getAllCruciblesFromDb(dispatch: Dispatch<AnyAction>, network: string) 
		:Promise<CrucibleInfo[]> {
		const crucibles = await this.api.api({
			command: 'getAllCruciblesFromDb',
			data: {network},
			params: [],
		} as JsonRpcRequest);
		if (!!crucibles) {
			dispatch(addAction(Actions.CRUCIBLES_LOADED, {crucibles}));
		}
		return crucibles || [];
	}

	async deposit(dispatch: Dispatch<AnyAction>,
		currency: string,
		crucible: string,
		amount: string,
		isPublic: boolean,
		) {
		try {
			return this.api.runServerTransaction(
				async () => {
					const network = this.api.getNetwork();
					return await this.api.api({
							command: isPublic ? 'depositPublicGetTransaction' : 'depositGetTransaction',
							data: {network, currency, crucible, amount}, params: [] } as JsonRpcRequest);
				});
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}

	async withdraw(dispatch: Dispatch<AnyAction>,
		currency: string,
		crucible: string,
		amount: string,
		) {
		try {
			return this.api.runServerTransaction(
				async () => {
					const network = this.api.getNetwork();
					return this.api.api({
							command: 'withdrawGetTransaction',
							data: {network, currency, crucible, amount}, params: [] } as JsonRpcRequest);
				}
			)
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}

	async stakeFor(dispatch: Dispatch<AnyAction>,
			stakeId: string, currency: string, amount: string) {
		return await this.api.runServerTransaction(async () => {
			const [network,] = Utils.parseCurrency(currency);
			const res = await this.api.api(
			{ command: 'stakeForGetTransaction', params: [], data: {
				currency,
				stake: (await this.contract(network)).staking,
				amount,
			}});
			console.log('PRE RES', res)
			return res;
		});
	}

	async contract(network: string) {
		const cc = CRUCIBLE_CONTRACTS_V_0_1[network];
		ValidationUtils.isTrue(!!cc, `Network "${network}" not supported`);
		return cc;
	}

	async deploy(dispatch: Dispatch<AnyAction>,
			baseCurrency: string,
			feeOnTransfer: string,
			feeOnWithdraw: string,) {
		try {
			return this.api.runServerTransaction(
				async () => {
					const [network,] = Utils.parseCurrency(baseCurrency);
					return this.api.api({
						command: 'deployGetTransaction',
						data: {baseCurrency, feeOnTransfer, feeOnWithdraw}, params: [] } as JsonRpcRequest);
				}
			)
		} catch (e) {
			console.error('deposit', e);
            dispatch(addAction(CommonActions.ERROR_OCCURED, {message: (e as Error).message || '' }));
		}
	}
}