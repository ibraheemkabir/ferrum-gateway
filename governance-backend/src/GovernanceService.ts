import { MongooseConnection } from "aws-lambda-helper";
import { EthereumSmartContractHelper } from "aws-lambda-helper/dist/blockchain";
import { Injectable, LocalCache, ValidationUtils, Networks } from "ferrum-plumbing";
import { Connection, Model, Document, Schema } from "mongoose";
import { GovernanceContract, GovernanceTransaction,
	MultiSigSignature, SignableMethod, Utils, QuorumSubscription, RegisteredContract } from "types";
import { CrucibleRouter__factory } from './resources/typechain/factories/CrucibleRouter__factory';
import { CrucibleRouter } from './resources/typechain/CrucibleRouter';
import { BasicIronSafe__factory } from './resources/typechain/factories/BasicIronSafe__factory';
import { BasicIronSafe } from './resources/typechain/BasicIronSafe';
import { GovernanceContractDefinitions, GovernanceContractList, safesList } from "./contracts/GovernanceContractList";
import { Eip712Params, multiSigToBytes, produceSignature, verifySignature } from 'web3-tools/dist/Eip712Utils';
import { randomBytes } from 'ferrum-crypto';
import { TransactionTrackableSchema, TransactionTracker } from 'common-backend/dist/contracts/TransactionTracker';

export const CACHE_TIMEOUT = 600 * 1000; // 10 min

const SigMethodCommonArgs = {
	expectedGroupId: 'expectedGroupId',
	multiSignature: 'multiSignature',
}

export function ensureNotExpired(expiry: number) {
	const now = Math.round(Date.now()/1000);
	ValidationUtils.isTrue(now < expiry, 'Allocation is expired');
}

const GovernanceTransactionSchema = new Schema<GovernanceTransaction&Document>({
	network: String,
	contractAddress: String,
	governanceContractId: String,
	requestId: String,
	quorum: String,
	created: Number,
	lastUpdate: Number,
	method: String,
	values: [String],
	signatures: [Object],
	archived: Boolean,
	logs: [String],
	execution: TransactionTrackableSchema,
	vetoSignatures: [Object],
});

const GovernanceTransactionModel = (c: Connection) => c.model<GovernanceTransaction&Document>('governanceTransactions', GovernanceTransactionSchema);

const RegisteredContractSchema = new Schema<RegisteredContract&Document>({
	network: String,
	contractAddress: String,
	governanceContractId: String,
});

const RegisteredContractModel = (c: Connection) => c.model<RegisteredContract&Document>('registeredContract', RegisteredContractSchema);

export class GovernanceService extends MongooseConnection implements Injectable {
	private cache = new LocalCache();
	private transactionsModel: Model<GovernanceTransaction&Document> | undefined;
	private registeredContract: Model<RegisteredContract&Document> | undefined;
	constructor(
		private helper: EthereumSmartContractHelper,
		private tracker: TransactionTracker,
	) {
		super();
	}

	__name__() { return 'GovernanceService'; }

	initModels(con: Connection): void {
		// Store allocations
		this.transactionsModel = GovernanceTransactionModel(con);
		this.registeredContract = RegisteredContractModel(con);
	}

	async listContracts() {
		this.verifyInit();
		const hardCoded = GovernanceContractList;
		const fromDb = await this.registeredContract.find({}).exec();
		return [
			...hardCoded,
			...fromDb.map(f => f.toJSON()),
		]
	}

	async listSafes() {
		this.verifyInit();
		const hardCoded = safesList;
		const fromDb = await this.registeredContract.find({}).exec();
		return [
			...hardCoded,
			...fromDb.map(f => f.toJSON()),
		]
	}

	async contractById(id: string) {
		return GovernanceContractDefinitions[id];
	}

	async getSubscription(network: string, contractAddress: string, userAddress: string, isSafe: boolean = false) {
		return await this.subscription(network, contractAddress, userAddress, isSafe);
	}

	async listTransactions(userAddress: string, network: string, contractAddress: string) {
		this.verifyInit();
		const sub = await this.subscription(network, contractAddress, userAddress);
		if (!sub) {
			return [];
		}
		const txs = await this.transactionsModel.find(
			{ 'quorum': sub.quorum, 'contractAddress': contractAddress }).exec();
		console.log('Finding ', { 'quorum': sub.quorum }, txs.length)
		return !!txs ? txs.map(t => t.toJSON()) : undefined;
	}

	/**
	 * Archives a request. Makes sure the archives is a valid signer from quorum
	 */
	async archiveTransaction(
		userAddress: string,
		requestId: string,
		signature: string,
		isSafe: boolean = false
	) {
		ValidationUtils.allRequired(['userAddress', 'requestId', 'signature'], {userAddress, requestId, signature});
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		await this.methodCall(tx.network, tx.contractAddress, tx.governanceContractId, tx.method, [], true, userAddress, signature, isSafe);
		await this.transactionsModel.findOneAndUpdate({requestId}, {archived: true});
		return await this.getGovTransaction(requestId);
	}

	async proposeTransaction(
		network: string,
		contractAddress: string,
		governanceContractId: string,
		method: string,
		args: string[],
		userAddress: string,
		signature: string,
		isSafe: boolean = false
	) {
		this.verifyInit();
		const [sub, sig] = await this.methodCall(network, contractAddress, governanceContractId, method, args, false, userAddress, signature, isSafe);
		const requestId = randomBytes(32);
		const isVeto = isSafe ? await this.vetoStatus(
			network,
			contractAddress,
			userAddress
		) : false

		const tx = {
			requestId,
			network,
			contractAddress,
			governanceContractId,
			quorum: sub.quorum.toLowerCase(),
			created: Date.now(),
			lastUpdate: Date.now(),
			method: sig.method,
			values: args,
			signatures: [
				{
					creationTime: Date.now(),
					creator: userAddress,
					signature,
				} as MultiSigSignature
			],
			vetoSignatures: isVeto ? [{
				creationTime: Date.now(),
				creator: userAddress,
				signature,
			} as MultiSigSignature] : [],
			archived: false,
			logs: [ `Created by ${userAddress}` ],
			execution: { status: '', transactions: [] },
		} as GovernanceTransaction;
		await new this.transactionsModel(tx)!.save();
		return await this.getGovTransaction(requestId);
	}

	async addSignature(
		userAddress: string,
		requestId: string,
		signature: string,
		isSafe: boolean
	) {
		this.verifyInit();
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		ValidationUtils.isTrue(!tx.signatures.find(s => s.creator.toLowerCase() === userAddress.toLowerCase()), 'Already signed by this user');
		const [sub, sig] = await this
			.methodCall(tx.network, tx.contractAddress, tx.governanceContractId, tx.method, tx.values, false, userAddress, signature, isSafe);
		ValidationUtils.isTrue(sub.quorum === tx.quorum, 
			`Signer is from a different quorum: ${sub.quorum} vs ${tx.quorum}`);
		
		const isVeto = await this.vetoStatus(
			tx.network,
			tx.contractAddress,
			userAddress
		)

		if (isVeto) {
			tx.vetoSignatures.push({
				creationTime: Date.now(),
				creator: userAddress.toLowerCase(),
				signature,
			} as MultiSigSignature);
		}
		tx.signatures.push({
			creationTime: Date.now(),
			creator: userAddress.toLowerCase(),
			signature,
		} as MultiSigSignature);
		await this.transactionsModel.findOneAndUpdate({requestId}, { signatures: tx.signatures });
		return await this.getGovTransaction(requestId);
	}

	async updateTransacionsForRequest(
		requestId: string,
		transactionId?: string,
		network?: string
	) {
		const r = await this.getGovTransaction(requestId);
		const execution = await this.tracker.upsert(r.execution || {} as any, network, transactionId);
		console.log(execution, r, transactionId, 'execution');
		if (!!execution) {
			await this.transactionsModel.findOneAndUpdate({requestId}, {execution});
		}
		return this.getGovTransaction(requestId);
	}

	async submitRequestGetTransaction(
		userAddress: string,
		requestId: string,
	) {
		const tx = await this.getGovTransaction(requestId);
		ValidationUtils.isTrue(!!tx, 'requestId not found: ' + requestId);
		console.log(tx.governanceContractId,'tx.governanceContractIdtx.governanceContractId')
		const [c, m] = await this.getMethod(tx.governanceContractId, tx.method);
		const quorumData = await this.contract(tx.network, tx.contractAddress)
			.quorums(tx.quorum);
		const expectedGroupId = quorumData[1];
		ValidationUtils.isTrue(Utils.isNonzeroAddress(quorumData[0]),
			`Quorum ${tx.quorum} doesnt exist on ${tx.contractAddress}`);

		tx.signatures.sort((s1, s2) => Buffer.from(s2.creator.replace('0x', ''), 'hex') < Buffer.from(s1.creator.replace('0x', ''), 'hex') ? 1 : -1);
		const multiSig = multiSigToBytes(tx.signatures.map(s => s.signature));
		
		// Custom logic for expectedGroupId and multiSignature?
		const web3 = this.helper.web3(tx.network);
		const contract = new web3.Contract([m.abi as any], tx.contractAddress);
		const values = tx.values;
		const groupIdIdx = m.abi.inputs.findIndex(a => a.name === SigMethodCommonArgs.expectedGroupId);
		if (groupIdIdx >= 0) {
			ValidationUtils.isTrue(groupIdIdx == m.abi.inputs.length - 2,
				"Contract's method arg 'expectedGroupId' must be the one before last");
			ValidationUtils.isTrue(m.abi.inputs.length === tx.values.length + 2,
				`Abi input size for method ${tx.method} is expected to be exactly 2 above the signable size`);
			values.push(expectedGroupId as any);
		} else {
			ValidationUtils.isTrue(m.abi.inputs.length === tx.values.length + 1,
				`Abi input size for method ${tx.method} is expected to be exactly 1 above the signable size (${m.abi.inputs.length} vs ${tx.values.length})`);
		}
		const multiSigIdx = m.abi.inputs.findIndex(a => a.name === SigMethodCommonArgs.multiSignature);
		ValidationUtils.isTrue(multiSigIdx >= 0,
			"Contract's method must have last argument: multiSignature");
		ValidationUtils.isTrue(multiSigIdx == m.abi.inputs.length - 1,
			"Contract's method arg 'multiSignature' must be the last one");
		values.push(multiSig);

		console.log('ABOUT TO CALL METHOD', m.abi.name, {values});

		const p = contract.methods[m.abi.name](...values);

		const gas = await this.estimateGasOrDefault(p, userAddress, undefined);
		const nonce = await this.helper.web3(tx.network)
			.getTransactionCount(userAddress, 'pending');
		return EthereumSmartContractHelper.callRequest(tx.contractAddress,
						'na',
						userAddress,
						p.encodeABI(),
						gas ? gas.toFixed() : undefined,
						nonce,
						tx.method);
	}

	async estimateGasOrDefault(method: any, from: string, defaultGas?: number) {
			try {
					return await method.estimateGas({from});
			} catch(e) {
					console.info('Error estimating gas. Tx might be reverting');
					return defaultGas;
			}
	}

	private async methodCall(
		network: string,
		contractAddress: string,
		contractId: string,
		method: string,
		values: string[],
		isArchive: boolean,
		userAddress: string,
		signature: string,
		isSafe: boolean): Promise<[QuorumSubscription, Eip712Params]> {
		const [contract, m] = await this.getMethod(contractId, method);
		const sig = this.produceMethodCall(network, contractAddress, contract, m, values, isArchive);
		const subscription = await this
			.authorize(network, contractAddress, userAddress, sig.hash, signature, m.governanceOnly, isSafe);
		return [subscription, sig];
	}

	private produceMethodCall(
		network: string,
		contractAddress: string,
		contract: GovernanceContract,
		m: SignableMethod,
		values: string[],
		isArchive: boolean,
	) {
		ValidationUtils.isTrue(isArchive || m.args.length === values.length, `Wrong number of arguments for method ${m.name}`);
		const args = isArchive ? 
			[
					{ type: "boolean", name: "archive", value: true as any },
			] : m.args.map((a, i) => ({ type: a.type, name: a.name, value: values[i] }));

		const params = { 
				contractName: contract.identifier.name,
				contractVersion: contract.identifier.version,
				method: m.name,
				args,
			} as Eip712Params
		const sig = produceSignature(
			this.helper.web3(network),
			Networks.for(network).chainId,
			contractAddress,
			params,
		);
		return sig;
	}

	private async authorize(network: string, contractAddress: string, userAddress: string, msg: string, signature: string, mustBeGov: boolean, isSafe: boolean = false) {
		// First, check if the user signature is valid. Once it is verified, make sure use is allowed on the contract
		console.log('To autorize', {
			network, contractAddress, userAddress, msg, signature
		})
		verifySignature(msg.replace('0x',''), userAddress, signature);
		const subscription = await this.subscription(network, contractAddress, userAddress, isSafe);
		console.log('Subscription', {subscription});
		ValidationUtils.isTrue(!!subscription, `Address ${userAddress} is not part of any quorum on ${network} - ${contractAddress}`);
		if (mustBeGov) {
			ValidationUtils.isTrue(subscription.groupId < 256, `Address ${userAddress} is of groupId ${subscription.groupId} which is not governance`);
		}
		return subscription;
	}

	private async getMethod(contractId: string, method: string): Promise<[GovernanceContract, SignableMethod]> {
		const registered = GovernanceContractList.find(c => c.governanceContractId === contractId);
		ValidationUtils.isTrue(!!registered, `Contract "${contractId}" is not registered`);
		const con = GovernanceContractDefinitions[contractId];
		ValidationUtils.isTrue(!!con, `Contract "${contractId} not found`);
		const meth = con.methods.find(m => m.name === method);
		ValidationUtils.isTrue(!!meth, `Contract "${contractId} has not method "${method}"`);
		return [con!, meth!];
	}

	private async vetoStatus(network: string, contractAddress: string, userAddress: string) {
		const isVeto = (await this.safeContract(network, contractAddress).vetoRights(userAddress)) || false;
		return isVeto;
	}

	private async subscription(network: string, contractAddress: string, userAddress: string, isSafe: boolean = false): Promise<QuorumSubscription | undefined> {
		const subscription = (await this.contract(network, contractAddress).quorumSubscriptions(userAddress)) || ['', 0, 0];
		console.log('first sub is ', Utils.isNonzeroAddress(subscription[0]), subscription[0])
		if (!subscription || !Utils.isNonzeroAddress(subscription[0])) {
			return undefined;
		}
		const mainQuorum = await this.contract(network, contractAddress).quorums(subscription[0]);
		const minSignatures = mainQuorum.minSignatures;
		const vetoRightsLength = isSafe ? (await this.safeContract(network, contractAddress).vetoRightsLength()) || 0 : 0

		const [quorum, groupId, ] = subscription;
		return { quorum: quorum.toLowerCase(), groupId, minSignatures, vetoCount: vetoRightsLength } as QuorumSubscription;
	}

	private async getGovTransaction(requestId: string): Promise<GovernanceTransaction|undefined> {
		this.verifyInit();
		ValidationUtils.isTrue(!!requestId, "requestId is required");
		const res = await this.transactionsModel.findOne({requestId}).exec();
		return !!res ? res.toJSON() : undefined;
	}

	private contract(network: string, contractAddress: string): CrucibleRouter {
		const provider = this.helper.ethersProvider(network);
		return CrucibleRouter__factory.connect(contractAddress, provider);
	}

	private safeContract(network: string, contractAddress: string): BasicIronSafe {
		const provider = this.helper.ethersProvider(network);
		return BasicIronSafe__factory.connect(contractAddress, provider);
	}
}

function shat256(requestId: string) {
	throw new Error("Function not implemented.");
}
