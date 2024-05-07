import { ethers, PopulatedTransaction } from 'ethers';
import { CrucibleContracts, CustomTransactionCallRequest, GasParameters, NetworkedConfig } from '../types/Contract';
import { StakingContracts } from 'types';
import { provider } from 'web3-core';

export function parseCurrency (currency: string): [string, string] {
    const params =  currency.split(':')
    return [params[0], params[1]]
}

export function ethersProvider(currentProvider: any) {
    const prov = new ethers.providers.Web3Provider(currentProvider as any);
    return prov;
}

export function fromTypechainTransaction(t: PopulatedTransaction): CustomTransactionCallRequest {
    return {
        amount: '',
        gas: {
            gasLimit: (t.gasLimit || '').toString(),
            gasPrice: (t.gasPrice || '').toString(),
        } as GasParameters,
        contract: t.to,
        currency: '',
        data: t.data,
        from: t.from,
        description: ``,
        nonce: t.nonce,
        value: t.value,
    } as CustomTransactionCallRequest;
}


export async function  fromTypechainTransactionWithGas(network: string, t: PopulatedTransaction, from: string, provider: provider): Promise<CustomTransactionCallRequest> {
    const transaction = fromTypechainTransaction(t);
    let gasLimit: string|undefined = undefined;
    try {
        gasLimit = (await ethersProvider(provider).estimateGas(t)).toString();
    } catch (e) {
        console.error('Error estimating gas for tx: ', t, e as Error);
    }
    transaction.gas.gasLimit = gasLimit!;
    return transaction;
}


export const CRUCIBLE_CONTRACTS_V_0_1: NetworkedConfig<CrucibleContracts> = {
	'RINKEBY': {
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		staking: '',
	},
	'BSC_TESTNET': {
		factory: '0x5b2b943Bd0598111C27c6B0AEf6255338e08D43d',
		router: '0x7807a7CEc6EA97025AE2f7eBF1C4f2fBcbD401A4',
		staking: '',
	},
	'BSC': {
		factory: '0xaa703e8114600C83240145B4B524d7547A3743be',
		router: '0x830A8E8Eb51639d79b50b24374A4a52541fD7788',
		staking: '',
	},
	'ETHEREUM': {
		factory: '',
		router: '',
		staking: '',
	},
	'POLYGON': {
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		staking: '',
	},
};

export const STAKING_CONTRACTS_V_0_1: NetworkedConfig<StakingContracts[]> = {
	'RINKEBY': [{
		factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
		router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
		openEnded: '',
		timed: '',
		address: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02'
	}],
	'BSC': [
		{
			factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
			router: '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
			openEnded: '',
			timed: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02',
			address: '0x64598E2FDe27ad33448c5443A37D6f08233dAf02'
		},
		{
			factory: '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
			router: '0x54C4c29e8f46B100eF10Af9331DaBFf33dfb1d62',
			openEnded: '',
			timed: '0x669319FD48A5364F725aa66b4C57Bb473194AEa5',
			address: '0x669319FD48A5364F725aa66b4C57Bb473194AEa5'
		},
		{
			factory: '0x60267694219DC99aa00E866508B9aEbbCf6649dd',
			router: '0x54c4c29e8f46b100ef10af9331dabff33dfb1d62',
			openEnded: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd',
			timed: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd',
			address: '0xAb0433AA0b5e05f1FF0FD293CFf8bEe15882cCAd'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			timed: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			address: '0xeab8290c54b6307016a736ff2191bf2aaef3b697'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			timed: '0xeab8290c54b6307016a736ff2191bf2aaef3b697',
			address: '0xeab8290c54b6307016a736ff2191bf2aaef3b697'
		},
		{
			factory: '0x948b3c3d27bc472c46addf617439248e9269e1e1',
			router: '0x3b83A1a700af32d17cE138d2527b2b48AdbA9b73',
			openEnded: '0xd87f304ca205fb104dc014696227742d20c8f10a',
			timed: '0xd87f304ca205fb104dc014696227742d20c8f10a',
			address: '0xd87f304ca205fb104dc014696227742d20c8f10a'
		},
        {
            "factory": "0xaa703e8114600C83240145B4B524d7547A3743be",
		    "router": "0x830A8E8Eb51639d79b50b24374A4a52541fD7788",
            "openEnded":"0x35E15ff9eBB37D8C7A413fD85BaD515396DC8008",
            "timed":"0x35E15ff9eBB37D8C7A413fD85BaD515396DC8008",
            "address":"0x35E15ff9eBB37D8C7A413fD85BaD515396DC8008"
         }
		//0xd87f304ca205fb104dc014696227742d20c8f10a
	],
	'ETHEREUM_ARBITRUM': [
		{
			"factory": '0x2E15Ad5a416BC23ad80B6A1882e885b797a78CaF',
			"router": '0xfE31f63BCd6Dd0297649Bb384ef2C89149c16A76',
            "openEnded":"0xB4927895cbEE88E651e0582893051b3B0f8D7DB8",
            "timed":"0xB4927895cbEE88E651e0582893051b3B0f8D7DB8",
            "address":"0xB4927895cbEE88E651e0582893051b3B0f8D7DB8"
         }
	]
};

export const PROVIDERS = {
        "BSC": "https://nd-683-219-356.p2pify.com/e98c28a04bcbb8f3c300f3571328b889",
        "BSC_TESTNET": "https://data-seed-prebsc-1-s1.binance.org:8545",
        "MOON_MOONBASE": "https://rpc.testnet.moonbeam.network",
        "MOON_MOONRIVER": "https://rpc.moonriver.moonbeam.network",
        "POLYGON": "https://nd-578-897-324.p2pify.com/a884db07e31262d90d874d43a1f575d8",
        "MUMBAI_TESTNET": "https://rpc-mumbai.maticvigil.com",
        "AVAX_MAINNET": "https://api.avax.network/ext/bc/C/rpc",
        "AVAX_TESTNET": "https://api.avax-test.network/ext/bc/C/rpc",
        "ETHEREUM": "https://nd-762-281-217.p2pify.com/0b5e1c7182b4287ab5ee8bcefdc79c99",
        "RINKEBY": "https://apis.ankr.com/6dfd4df95a334c87834bcdf1a709ed29/668d162102a8a9a27cb1a4a1abc76cbe/eth/fast/rinkeby",
        "PROCESSOR_PRIVATE_KEY_CLEAN_TEXT": "asdf",
        "HARMONY_TESTNET_0": "https://api.s0.b.hmny.io",
        "FTM_TESTNET": "https://rpc.testnet.fantom.network/",
        "FTM_MAINNET": "https://rpc.ftm.tools/",
        "FTM_MAINNNET": "https://rpc.ftm.tools/",
        "BLACKLIST_ADMIN_SECRET": "BLACKLISTADMIN",
        "SHIDEN_TESTNET": "https://rpc.shibuya.astar.network:8545",
        "SHIDEN_MAINNET": "https://shiden.api.onfinality.io/public",
        "HARMONY_MAINNET_0": "https://api.harmony.one",
        "FUSE_MAINNET": "https://rpc.fuse.io/",
        "VELAS_MAINNET": "https://explorer.velas.com/rpc",
        "VELAS_TESTNET": "https://rpc.velaverse.io",
        "ETHEREUM_ARBITRUM": "https://nd-357-728-210.p2pify.com/43b194feae1d3151549a1ccce27a7697",
        "ARBITRUM_ETHEREUM": "https://nd-357-728-210.p2pify.com/43b194feae1d3151549a1ccce27a7697",
		"ARBITRUM": "https://nd-357-728-210.p2pify.com/43b194feae1d3151549a1ccce27a7697",
        "FERRUM_TESTNET": "http://testnet.dev.svcs.ferrumnetwork.io:8545",
        "GOERLI_TESTNET": "https://rpc.ankr.com/eth_goerli",
        "ETHEREUM_GOERLI": "https://rpc.ankr.com/eth_goerli",
    }