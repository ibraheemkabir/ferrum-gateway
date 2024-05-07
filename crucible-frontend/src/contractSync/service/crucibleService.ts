import { BigUtils, UserContractAllocation } from "types";
import { CrucibleFactory, CrucibleFactory__factory, CrucibleRouter, CrucibleRouter__factory, ERC20Burnable__factory, ERC20, CrucibleToken, CrucibleToken__factory, ERC20__factory, StakeOpen, StakeOpen__factory } from "../typechain";
import { CrucibleConfig, CustomTransactionCallRequest, Web3ProviderConfig } from "../types/Contract";
import { STAKING_CONTRACTS_V_0_1, ethersProvider, fromTypechainTransaction, fromTypechainTransactionWithGas, parseCurrency } from "../utils/contracts";
import { Big } from 'big.js';
import Web3 from 'web3';
import { ContractHelper } from "../utils/contractHelper";
import { ValidationUtils } from "ferrum-plumbing";
const MAX_AMOUNT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export class CrucibleService {
    ROUTER_NAME = 'FERRUM_CRUCIBLE_ROUTER';
	ROUTER_VERSION = '000.001';

    constructor(private provider: Web3ProviderConfig, private config: CrucibleConfig) {}

    private _web3(network: string): Web3 {
        const prov = new Web3(new Web3.providers.HttpProvider( this.provider[network]));
        return prov;
    }

    public web3(network: string) {
		return (this._web3(network) || {} as any).eth;
    }

    async getCrucible(crucibleCurrency: string, staking?: string) {
        try {
            const [network, address] = ContractHelper.parseCurrency(crucibleCurrency);
            const crucible = await this.getCrucibleInfo(crucibleCurrency, address, staking)
            return crucible
        } catch (error) {
            console.log(error)
        }
	
	}

    async getUserCrucibleInfo(crucible: string, userAddress: string, staking?: string) {
		const baseCurrency = await this.baseCurrency(crucible);
		const cru = await this.crucible(crucible);
		const base = await this.crucible(baseCurrency);
		const balanceOfInt = (await cru.balanceOf(userAddress)).toString();
		const basebalanceOfInt = (await base.balanceOf(userAddress)).toString();
		const allocations: any[] = [];
		const [network, contractAddress] = ContractHelper.parseCurrency(crucible);
		const stakingConfigured = STAKING_CONTRACTS_V_0_1;
		const stakes: any[] = []
        const currency = await this.baseCurrency(crucible);
        const decimal = await this.decimals(currency)
		const staking_contract = staking ? stakingConfigured[network].find(item => item.address == staking) : false
		if(staking_contract) {
			const stakingType = await this.stakingConfigured(staking_contract.address || '',network,contractAddress)
			if(Number(stakingType[0]||'0') > 0 && staking_contract.address){
				const totalStake = await this.stakingTotal(staking_contract.address, network,contractAddress, decimal)
				const stakeOf = await this.stakingOf(staking_contract.address, network,contractAddress,userAddress, decimal)
				const rewardOf= await this.stakingRewardOf(staking_contract.address, network,contractAddress,userAddress,contractAddress, decimal)
				stakes.push({stakingType,totalStake,stakeOf,rewardOf,address: staking_contract.address})
			}
		}
		
		// if(stakingConfigured[network]){
		// 	for(let stakingContract of stakingConfigured[network]){
		// 		const stakingType = await this.stakingConfigured(stakingContract.address || '',network,contractAddress)
		// 		if(Number(stakingType[0]||'0') > 0 && stakingContract.address){
		// 			const totalStake = await this.stakingTotal(stakingContract.address, network,contractAddress, decimal)
		// 			const stakeOf = await this.stakingOf(stakingContract.address, network,contractAddress,userAddress, decimal)
		// 			const rewardOf= await this.stakingRewardOf(stakingContract.address, network,contractAddress,userAddress,contractAddress, decimal)
		// 			stakes.push({stakingType,totalStake,stakeOf,rewardOf,address: stakingContract.address})
		// 		}
		// 	}
			
		// }

		const userInfo = {
			currency: crucible,
			baseCurrency,
			balance: await ContractHelper.amountToHuman(crucible, balanceOfInt, decimal),
			baseBalance: await ContractHelper.amountToHuman(baseCurrency, basebalanceOfInt, decimal),
			symbol: await this.symbol(crucible),
			baseSymbol: await this.symbol(baseCurrency),
			uniswapPairBalance: '',
			allocations,
			stakes,
		};

        return userInfo
	}

	async getContractAllocation(userAddress: string, contractAddress: string, currency: string): Promise<UserContractAllocation> {
		ValidationUtils.isTrue(!!userAddress, '"userAddress" must be provided');
		ValidationUtils.isTrue(
		  !!contractAddress,
		  '"contractAddress" must be provided'
		);
		console.log('currency')
		ValidationUtils.isTrue(!!currency, '"currency" must be provided');
		const allocation = await this.allocation(
		  userAddress,
		  contractAddress,
		  currency
		);
		console.log(allocation)
		return allocation
	}

	 approveAllocationGetTransaction(userAddress: string, contractAddress: string, currency: string, amount: string): Promise<any> {
		ValidationUtils.isTrue(!!userAddress, '"userAddress" must be provided');
		ValidationUtils.isTrue(
		  !!contractAddress,
		  '"contractAddress" must be provided'
		);
		ValidationUtils.isTrue(!!currency, '"currency" must be provided');
		ValidationUtils.isTrue(!!amount, '"amount" must be provided');
		return this.approveGetTransaction(
		  userAddress,
		  contractAddress,
		  currency,
		  amount
		);
	  }
	

    async getCrucibleInfo(crucible: string, userAddress: string, staking?: string) {
		const [network, contractAddress] = ContractHelper.parseCurrency(crucible);
		const crucibleInfo = await this.crucibleFromNetwork(crucible);
        const currency = await this.baseCurrency(crucible);
        const decimal = await this.decimals(currency)

		// try one inch implementation to test
		const priceUsdt = '0' //await this.pricing.usdPrice(crucible.currency);
		const priceEth = '0' //await this.pricing.ethPrice(crucible.currency);
		const basePriceUsdt = '0' // await this.pricing.usdPrice(crucible.baseCurrency);
		const basePriceEth = '0' // await this.pricing.ethPrice(crucible.baseCurrency);
		const leftFromCap = (await this.remainingFromCap(crucibleInfo.currency, decimal))?.value;
		const feeOnTransferRate = await this.crucibleFeeOnTransferRate(crucibleInfo.currency);
		const feeOnWithdrawRate = await this.crucibleFeeOnWithdrawRate(crucibleInfo.currency);

		const totalSupply = await this.crucibleSupply(crucibleInfo.currency, decimal);

		const r = await this.router(network);

		const openCapInt = (await r.openCaps(contractAddress)).toString();
		const stakingConfigured = STAKING_CONTRACTS_V_0_1
		const stakes = []
		const staking_contract = staking ? stakingConfigured[network].find(item => item.address == staking) : false
		if(staking_contract) {
			const stakingType = await this.stakingConfigured(staking_contract.address || '',network,contractAddress)
			if(Number(stakingType[0]||'0') > 0 && staking_contract.address){
				const totalStake = await this.stakingTotal(staking_contract.address, network,contractAddress, decimal)
				const stakeOf = await this.stakingOf(staking_contract.address, network,contractAddress,userAddress, decimal)
				const rewardOf= await this.stakingRewardOf(staking_contract.address, network,contractAddress,userAddress,contractAddress, decimal)
				stakes.push({stakingType,totalStake,stakeOf,rewardOf,address: staking_contract.address})
			}
		}

		return {
			...crucibleInfo,
			network,
			contractAddress,
			openCap: await ContractHelper.amountToHuman(crucible, openCapInt, decimal),
			priceUsdt,
			priceEth,
			basePriceUsdt,
			basePriceEth,
			leftFromCap,
			feeOnTransferRate,
			feeOnWithdrawRate,
			totalSupply,
			feeDescription: '',
			staking:stakes
		};
	}

    async deployGetTransaction(
        userAddress: string,
		baseCurrency: string,
		feeOnTransfer: string,
		feeOnWithdraw: string,
        name: string,
		symbol:string
    ): Promise<string | undefined> {
        const [network, baseToken] = parseCurrency(baseCurrency)
        const factory = await this.factory(network);
        const feeOnTransferX10000 = BigUtils.parseOrThrow(feeOnTransfer, 'feeOnTransfer')
        .mul(10000).toFixed(0);
        const feeOnWithdrawX10000 = BigUtils.parseOrThrow(feeOnWithdraw, 'feeOnWithdraw')
        .mul(10000).toFixed(0);
        const t = await factory.populateTransaction.createCrucible(
			baseToken,
			feeOnTransferX10000,
			feeOnWithdrawX10000,
			{ from: userAddress }
		);

        const tx = fromTypechainTransaction(t);
        return this.sendTransactionAsync([tx], {})
    }

    async depositPublicGetTransaction(
		cur: string,
		crucible: string,
		amount: string,
		from: string,
	): Promise<CustomTransactionCallRequest> {
		const [network, contractAddress] = parseCurrency(crucible);
        const factory = await this.router(network);
		const t = await factory.populateTransaction.depositOpen(
			from,
			contractAddress,
			await ContractHelper.amountToMachine(amount, 18),
			{from});
		return fromTypechainTransaction(t);
	}

    async DepositAndStakeTransaction(
        stakeAddress: string,
		crucible: string,
		amount: string,
		from: string,
	): Promise<CustomTransactionCallRequest> {
		const [network, contractAddress] = parseCurrency(crucible);
        const factory = await this.router(network);
        const decimal = 18
		const t = await factory.populateTransaction.depositAndStake(
			from,
			contractAddress,
			await ContractHelper.amountToMachine(amount, decimal),
            stakeAddress,
            '0x' + '00'.repeat(32),
            0,
            0,
            '0x',
            {from}
        );
		return fromTypechainTransaction(t);
	}

    async StakeTransaction(
		crucible: string,
		amount: string,
		stake: string,
        from: string
	) {
        try {
            const [network, contractAddress] = parseCurrency(crucible);
            const factory = await this.router(network);
            const decimal = 18
            const t = await factory.populateTransaction.stakeFor(
                from,
                contractAddress,
                stake,
                await ContractHelper.amountToMachine(amount, decimal),
                { from: from }
            );
            return fromTypechainTransaction(t);
        } catch (error) {
            console.log(error)
        }

	}

    async UnStakeTransaction(
		crucible: string,
		amount: string,
		stake: string,
        from: string
	): Promise<CustomTransactionCallRequest> {
		const [network, contractAddress] = parseCurrency(crucible);
		const r = await this.router(network);
        const factory = await this.staking(stake, network);
        const decimal = 18
		console.log(decimal, 'decimal')
		const t = await factory.populateTransaction.withdraw(
			from,
            contractAddress,
			await ContractHelper.amountToMachine(amount, decimal),
			{ from: from }
        );
		return fromTypechainTransaction(t);
	}

    async WithdrawTransaction(
		crucible: string,
		amount: string,
        to: string
	): Promise<CustomTransactionCallRequest> {
        const factory = await this.crucible(crucible);
        const decimal = 18
		const t = await factory.populateTransaction.withdraw(
			to,
            await ContractHelper.amountToMachine(amount, decimal),
            {from : to}
        );
		return fromTypechainTransaction(t);
	}

    async withdrawRewards(
        to: string,
		crucible: string,
        amount: string,
        stake:string
    ) {
		const [network, _] = parseCurrency(crucible);
        const factory = await this.staking(network, stake);
		const t = await factory.populateTransaction.withdrawRewards(
			to,
            amount,
            {from : to}
        );
		return fromTypechainTransaction(t);
	}

    private async crucibleFromNetwork(crucible: string) {
		const [network, ] = ContractHelper.parseCurrency(crucible);
		const baseCurrency = await this.baseCurrency(crucible);
		const name = (await (await this.crucible(crucible)).name()).toString();

		return {
			currency: crucible,
			baseCurrency,
			symbol: await this.symbol(crucible),
			baseSymbol: await this.symbol(baseCurrency),
			name,
		} as any;
	}

    async factory (network: string): Promise<CrucibleFactory> {
        const currentProvider = this.web3(network).currentProvider
        const provider = await ethersProvider(currentProvider)
        return CrucibleFactory__factory.connect(this.config.contracts[network].factory, provider);
    }

    async router(network: string): Promise<CrucibleRouter> {
        console.log(network, 'networknetwork')
        const currentProvider = this.web3(network).currentProvider
        const provider = await ethersProvider(currentProvider)
        console.log(provider, this.config.contracts, network)

		return CrucibleRouter__factory.connect(this.config.contracts[network].router, provider);
	}

    private async baseCurrency(crucible: string): Promise<string> {
		const [network,] = ContractHelper.parseCurrency(crucible);
		const tok = await this.crucible(crucible);
		return ContractHelper.toCurrency(network, ContractHelper.canonicalAddress(network as any, await tok.baseToken()));
	}

    async crucible(crucible: string): Promise<CrucibleToken> {
		const [network, address] = ContractHelper.parseCurrency(crucible);
        const currentProvider = this.web3(network).currentProvider
		const provider = await ethersProvider(currentProvider);
		return CrucibleToken__factory.connect(address, provider);
	}

	async erc20(network: string, token: string) {
        const currentProvider = this.web3(network).currentProvider
		const provider = await ethersProvider(currentProvider);
		return CrucibleToken__factory.connect(token, provider);
    }

    async staking(stakingContract: string, network: string): Promise<StakeOpen> {
        const currentProvider = this.web3(network).currentProvider
		const provider = await ethersProvider(currentProvider);
		return StakeOpen__factory.connect(stakingContract, provider);
	}

    private async stakingConfigured(contract:string,network:string,id:string): Promise<any> {
		const staking = await this.staking(contract,network);
	    const type = await staking.stakings(id)
		return type
	}

    private async stakingTotal(contract:string,network:string,id:string, decimal: number): Promise<string> {
		const staking = await this.staking(contract,network);
		const stakedTotal = await staking.stakedBalance(id)
		return ContractHelper.amountToHuman(`${network}:${id}`,stakedTotal?.toString(), decimal)
	}

    private async stakingOf(contract:string,network:string,id:string ,userAddress:string, decimal: number): Promise<string> {
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.stakeOf(id,userAddress)
		return ContractHelper.amountToHuman(`${network}:${id}`,stakeValue?.toString(), decimal)
	}

	private async stakingRewardOf(contract:string,network:string,id:string,userAddress:string,crucible:string, decimal: number): Promise<string> {
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.rewardOf(id,userAddress,[crucible])
		return ContractHelper.amountToHuman(`${network}:${crucible}`,stakeValue?.toString(), decimal)
	}


    public async decimals(crucible: string): Promise<number> {
        const [network, address] = ContractHelper.parseCurrency(crucible);
        const currentProvider = this.web3(network).currentProvider
        const provider = await ethersProvider(currentProvider);
        const tokenCon = ERC20__factory.connect(address, provider);
        const decimal = await tokenCon.decimals()
        return decimal;
    }

    public async symbol(currency: string): Promise<string> {
        const [network, token] = ContractHelper.parseCurrency(currency);
        const currentProvider = this.web3(network).currentProvider
        const provider = await ethersProvider(currentProvider);
        const tokenCon = ERC20__factory.connect(token, provider);
        const symbol = await tokenCon.symbol()
        return symbol;
    }

    async remainingFromCap(crucible: string, decimal: number) {
		const [network, address] = ContractHelper.parseCurrency(crucible);
		const r = await this.router(network);
		const cap = await r.openCaps(address);
		const currency = await this.baseCurrency(crucible);
		return {
			currency,
			value: await ContractHelper.amountToHuman(currency, cap.toString(), decimal),
		};
	}

    private async crucibleSupply(crucible: string, decimal: number): Promise<string> {
		const [network, address] = ContractHelper.parseCurrency(crucible);
		const tok = await this.crucible(crucible);
		const sup = (await tok.totalSupply()).toString();
		return ContractHelper.amountToHuman(crucible, sup, decimal);
	}

    private async crucibleFeeOnTransferRate(crucible: string): Promise<string> {
		const tok = await this.crucible(crucible);
        const res = (await tok.feeOnTransferX10000()).toString();
        return BigUtils.parseOrThrow(res, 'feeOnTransferRate').div(10000).toString();
	}

	private async crucibleFeeOnWithdrawRate(crucible: string): Promise<string> {
		const tok = await this.crucible(crucible);
        const res = (await tok.feeOnWithdrawX10000()).toString();
        return BigUtils.parseOrThrow(res, 'feeOnTransferRate').div(10000).toString();
	}

    private async totalPoolReward(contract:string,network:string,id:string,crucible:string, decimal: number): Promise<string> {
		const staking = await this.staking(contract,network);
		const stakeValue = await staking.rewardsTotal(id,crucible)
		return ContractHelper.amountToHuman(`${network}:${crucible}`,stakeValue.toString(), decimal)
	}

	public async currentAllowance(currency: string, from: string, approvee: string) {
        const [network, token] = ContractHelper.parseCurrency(currency);
		console.log(network, token)
        const allowance = await (await this.erc20(network, token)).allowance(from, approvee);
		console.log(allowance)
        const bAllownace = new Big(allowance.toString());
		console.log(bAllownace, 'bAllownacebAllownacebAllownace')
        console.log('current allowance is ', bAllownace.toString(), ' for ', approvee, 'from', from);
        return bAllownace;
    }

	async allocation(userAddress: string, contractAddress: string, currency: string) {
		console.log('hellloooo')
		const allocation = await this.currentAllowance(currency, userAddress, contractAddress);
		const [network, _] = ContractHelper.parseCurrency(currency)
		const decimal = await this.decimals(currency)
		console.log(allocation, network, decimal)
		return {
			allocation: await ContractHelper.amountToHuman(currency, allocation.toFixed(), decimal),
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
		const [nonce, tx] = !amount ? await this.approveMaxRequests(
			currency, userAddress,
			amount, contractAddress, 'the given contract')
		: await this.approveRequests(
			currency, userAddress,
			amount, contractAddress, 'the given contract')

		return tx;
	}


    public async approveMaxRequests(
        currency: string,
        approver: string,
        value: string,
        approvee: string,
        approveeName: string,
        nonce?: number,
        ): Promise<[number, CustomTransactionCallRequest[]]> {
        return this._approveRequests(currency, approver, value, approvee, approveeName, true, nonce);
    }

    public async approveRequests(
        currency: string,
        approver: string,
        value: string,
        approvee: string,
        approveeName: string,
        nonce?: number,
        ): Promise<[number, CustomTransactionCallRequest[]]> {
        return this._approveRequests(currency, approver, value, approvee, approveeName, false, nonce);
    }

    private async _approveRequests(
        currency: string,
        approver: string,
        value: string,
        approvee: string,
        approveeName: string,
        maxAmount: boolean,
        nonce?: number,
        ): Promise<[number, CustomTransactionCallRequest[]]> {
        ValidationUtils.isTrue(!!approver, "'approver' must be provided");
        ValidationUtils.isTrue(!!approvee, "'approvee' must be provided");
        ValidationUtils.isTrue(!!approveeName, "'approveeName' must be provided");
        ValidationUtils.isTrue(!!currency, "'currency' must be provided");
        ValidationUtils.isTrue(!!value, "'value' must be provided");
        const [network, token] = ContractHelper.parseCurrency(currency);
        const tokDecimalFactor = 10 ** await this.decimals(currency);
        const amount = new Big(value).times(new Big(tokDecimalFactor));
        nonce = nonce || await this.web3(network).getTransactionCount(approver, 'pending');
        const amountHuman = amount.div(tokDecimalFactor).toString();
        const symbol = await this.symbol(currency);
        let requests: CustomTransactionCallRequest[] = [];
        return await this.addApprovesToRequests(requests, nonce!,
            amount, amountHuman, token, symbol, currency, approver, approvee,
            approveeName, maxAmount);
    }


	private async addApprovesToRequests(requests: CustomTransactionCallRequest[],
		nonce: number,
		amount: any,
		amountHuman: string,
		token: string,
		symbol: string,
		currency: string,
		address: string,
		approvee: string,
		approveeName: string,
		useMax: boolean,
		): Promise<[number, CustomTransactionCallRequest[]]> {
	const currentAllowance = await this.currentAllowance(currency, address, approvee);
		if (currentAllowance.lt(amount)) {
			let approveGasOverwite: number = 0;
			if (currentAllowance.gt(new Big(0))) {
				const approveToZero = await this.approveToZero(currency, address,
					approvee);
				requests.push(
					ContractHelper.callRequest(token, currency, address, approveToZero,
						'', nonce,
						`Zero out the approval for ${symbol} by ${approveeName}`,),
						);
				nonce++;
			}
			const [approve, approveGas] = useMax ? await this.approveMax(currency, address,
					approvee, approveGasOverwite) :
				await this.approve(currency, address,
					amount, approvee, approveGasOverwite);
			requests.push(
				ContractHelper.callRequest(token, currency, address, approve, approveGas.toString(), nonce,
					`Approve ${useMax ? 'max' : amountHuman} ${symbol} to be spent by ${approveeName}`,)
			);
			nonce++;
		}
		return [nonce, requests];
	}

	public async approveToZero(currency: string, from: string, approvee: string): Promise<any> {
        const [network, token] = ContractHelper.parseCurrency(currency);
        const m = (await this.erc20(network, token)).approve(approvee, '0');
        return m
    }

	public async approve(currency: string,
		from: string,
		rawAmount: any,
		approvee: string,
		useThisGas: number): Promise<any> {
		const [network, token] = ContractHelper.parseCurrency(currency);
		console.log('about to approve: ', { from, token, approvee, amount: rawAmount.toFixed(), })
		const m = (await this.erc20(network, token)).approve(approvee, rawAmount.toFixed());
		return m;
	}

	public async approveMax(currency: string,
			from: string,
			approvee: string,
			useThisGas: number): Promise<any> {
		const [network, token] = ContractHelper.parseCurrency(currency);
		console.log('about to approve max: ', { from, token, approvee})
		const m = (await this.erc20(network, token)).approve(approvee, MAX_AMOUNT);
		return m
	}

    public async sendTransactionAsync(
        payload: any[],
        info: any
    ) {
        try {
            const tx_payload = payload.map(e => {
                return {
                    from: e.from,
                    to: e.contract,
                    data: e.data,
                    value: e.amount ? Web3?.utils.toHex(e.amount) : e.amount
                }
            })
            const txHash = await (window as any).ethereum.request({
                method: "eth_sendTransaction",
                params: tx_payload
            })
            
            if (txHash) {
                return txHash + '|' + JSON.stringify(info || '')
            }
            return ''
        } catch (error) {
            console.log(error)
        }
    }

}