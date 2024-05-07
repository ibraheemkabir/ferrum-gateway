import { ERC20__factory } from "../typechain";
import Big from 'big.js';
import { CustomTransactionCallRequest } from "../types/Contract";

export class ContractHelper {
    __name__() { return 'ContractHelper'; }

    public static toCurrency(network: string, token: string): string {
        return `${network}:${token}`;
    }

    public static async amountToMachine(amount: string, decimal: number): Promise<string> {
        const decimalFactor = 10 ** decimal;
        return new Big(amount).times(decimalFactor).toFixed(0);
    }

    public static async amountToHuman(currency: string, amount: string, decimal: number): Promise<string> {
        const decimalFactor = 10 ** decimal;
        return new Big(amount).div(decimalFactor).toFixed();
    }

    public static canonicalAddress(network: string, address: string) {
        // TODO: Turn address to byte and back instead of lowercase.
        if (['ETHEREUM', 'RINKEBY', 'BINANCE', 'BINANCE_TESTNET', 'BSC', 'BSC_TESTNET',
			'POLYGON', 'MUMBAI_TESTNET'
                ].indexOf(network) >= 0) {
            return address.toLowerCase();
        } else {
            return address;
        }
    }

    public static callRequest(contract: string, currency: string, from: string, data: string, gasLimit: string, nonce: number,
        description: string): CustomTransactionCallRequest {
        return {
            currency,
            from,
            amount: '0',
            contract,
            data,
            gas: { gasPrice: '0', gasLimit },
            nonce,
            description,
        };
    }



    public static parseCurrency (currency: string): [string, string] {
        const params =  currency.split(':')
        return [params[0], params[1]]
    }


}