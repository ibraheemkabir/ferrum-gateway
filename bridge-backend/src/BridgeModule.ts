import { AwsEnvs, KmsCryptor, MongooseConfig, SecretsProvider } from "aws-lambda-helper";
import { EthereumSmartContractHelper, Web3ProviderConfig } from "aws-lambda-helper/dist/blockchain";
import { ChainClientFactory, ChainClientsModule, MultiChainConfig } from "ferrum-chain-clients";
import { ConsoleLogger, Container, EncryptedData, LoggerFactory, Module, ValidationUtils } from "ferrum-plumbing";
import { PairAddressSignatureVerifyre } from "./common/PairAddressSignatureVerifyer";
import { TokenBridgeService } from "./TokenBridgeService";
import { BridgeConfigStorage } from "./BridgeConfigStorage";
import { BridgeProcessor } from "./BridgeProcessor";
import { BridgeProcessorConfig,getEnv } from "./BridgeProcessorTypes";
import { BridgeRequestProcessor } from "./BridgeRequestProcessor";

import {
    LambdaGlobalContext
} from 'aws-lambda-helper';
import { KMS } from 'aws-sdk';
require('dotenv').config();
const global = { init: false };
export class BridgeModule implements Module {
    async configAsync(container: Container) {
        const region = process.env.AWS_REGION || process.env[AwsEnvs.AWS_DEFAULT_REGION] || 'us-east-2';
        const confArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'BRIDGE_PROCESSOR'];
        let conf: BridgeProcessorConfig = {} as any;
        if (confArn) {
            conf = await new SecretsProvider(region, confArn).get();
        } else {
            conf = {
                database: {
                    connectionString: getEnv('MONGOOSE_CONNECTION_STRING'),
                } as MongooseConfig,
                addressManagerEndpoint: getEnv('ADDRESS_MANAGER_ENDPOINT'),
                addressManagerSecret: getEnv('ADDRESS_MANAGER_SECRET'),
                payer: {
                    'ETHEREUM': getEnv('TOKEN_BRDIGE_CONTRACT_ETHEREUM'),
                    'RINKEBY': getEnv('TOKEN_BRDIGE_CONTRACT_RINKEBY'),
                    'BSC': getEnv('TOKEN_BRDIGE_CONTRACT_BSC'),
                    'BSC_TESTNET': getEnv('TOKEN_BRDIGE_CONTRACT_BSC_TESTNET'),
                },
            } as BridgeProcessorConfig;
        }

        const chainConfArn = process.env[AwsEnvs.AWS_SECRET_ARN_PREFIX + 'CHAIN_CONFIG'];
        const chainConf: MultiChainConfig = !!chainConfArn ? await new SecretsProvider(region, chainConfArn).get() : 
            ({
                web3Provider: getEnv('WEB3_PROVIDER_ETHEREUM'),
                web3ProviderRinkeby: getEnv('WEB3_PROVIDER_RINKEBY'),
                web3ProviderBsc: getEnv('WEB3_PROVIDER_BSC'),
                web3ProviderBscTestnet: getEnv('WEB3_PROVIDER_BSC_TESTNET'),
            } as any as MultiChainConfig);
        container.register('MultiChainConfig', () => chainConf);
        container.registerModule(new ChainClientsModule());

        const networkProviders = {
                    'ETHEREUM': chainConf.web3Provider,
                    'RINKEBY': chainConf.web3ProviderRinkeby,
                    'BSC': chainConf.web3ProviderBsc!,
                    'BSC_TESTNET': chainConf.web3ProviderBscTestnet!,
                } as Web3ProviderConfig;
        const privateKey = getEnv('PROCESSOR_PRIVATE_KEY_CLEAN_TEXT') ||
            await decryptPrivateKey(region, getEnv('KEY_ID'), getEnv('PROCESSOR_PRIVATE_KEY_ENCRYPTED'));

        container.registerSingleton(BridgeProcessor, c => new BridgeProcessor(
            conf, c.get(ChainClientFactory), c.get(TokenBridgeService),
            c.get(BridgeConfigStorage), c.get(PairAddressSignatureVerifyre),
            c.get(EthereumSmartContractHelper),
            privateKey,
            c.get(LoggerFactory)));
        container.register('JsonStorage', () => new Object());
        container.registerSingleton(TokenBridgeService, c => new TokenBridgeService(
            c.get(EthereumSmartContractHelper),
            ({}) as any,
            c.get(PairAddressSignatureVerifyre)));
        container.registerSingleton(EthereumSmartContractHelper, () => new EthereumSmartContractHelper(
            networkProviders));
        container.register(PairAddressSignatureVerifyre, () => new PairAddressSignatureVerifyre());
        container.registerSingleton(BridgeConfigStorage, () => new BridgeConfigStorage())
        container.register(LoggerFactory,
            () => new LoggerFactory((name: string) => new ConsoleLogger(name)));

        await container.get<TokenBridgeService>(TokenBridgeService).init(conf.database);
        await container.get<BridgeConfigStorage>(BridgeConfigStorage).init(conf.database);
    }
}

async function decryptPrivateKey(region: string, keyId: string, keyJson: string): Promise<string> {
    ValidationUtils.isTrue(!!keyJson, 'Private key must be provided');
    const key = JSON.parse(keyJson) as EncryptedData;
    return await new KmsCryptor(new KMS({region}), keyId).decryptToHex(key);
}