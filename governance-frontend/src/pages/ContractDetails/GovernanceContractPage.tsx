import React, { Dispatch, useEffect } from 'react';
import { AnyAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ChainEventBase, GovernanceContract, GovernanceTransaction, inject, QuorumSubscription, SignableMethod, Utils } from 'types';
import { GovernanceAppState } from '../../common/GovernanceAppState';
import { Card } from '../../components/Card';
import { GovernanceClient } from '../../GovernanceClient';
import './ContractList.css';
import {
	Row, RegularBtn, Page,
	// @ts-ignore
} from 'component-library';
import { addressForUser, ChainEventItem } from 'common-containers';
import { UserSubscription } from '../UserSubscription';
import { FButton } from "ferrum-design-system";

function argList(m?: SignableMethod) {
	if (!m) { return '[err - not found]';}
	return m.args.map(a => `${a.type} ${a.name}`).join(', ');
}

export const loadSubscription = createAsyncThunk('governanceContract/loadSubscription',
	async (payload: { network: string, contractAddress: string, isSafe: boolean }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.getSubscription(ctx.dispatch, payload.network, payload.contractAddress, payload.isSafe);
});

export const loadContract = createAsyncThunk('governanceContract/load',
	async (payload: { network: string, contractAddress: string, contractId: string, isSafe: boolean }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.contractById(ctx.dispatch, payload.contractId, payload.isSafe);
});

async function updateTransaction(
	item: ChainEventBase, 
	dispatch: any,
	contractAddress: string,
	requestId: string,
	txId: string,
	status: string,
	isSafe: boolean
): Promise<ChainEventBase> {
    try {
		console.log('Updating item ', item.id, item);
		const client = inject<GovernanceClient>(GovernanceClient);
		
		if (status === 'pending') {
			const res = await client.updateTransaction(
				dispatch,
				contractAddress,
				requestId,
				txId,
				isSafe
			);
			
			return { ...item, status: res.execution.status === "successful" 
				? "completed" 
				:  res.execution.status
			};
		}

		return { ...item }
		
    } catch(e) {
        console.error('updateWithdrawItem ', e);
        return item;
    }
}

// const updateTransaction = createAsyncThunk('method/submit',
// 	async (payload: { requestId: string, contractAddress: string, txId: string }, ctx) => {
// 		const client = inject<GovernanceClient>(GovernanceClient);
		
// 		const res = await client.updateTransaction(ctx.dispatch, payload.contractAddress, payload.requestId, payload.txId);
// 		console.log(res, 'resres')
// 	});


export const loadTrans = createAsyncThunk('governanceContract/load',
	async (payload: { network: string, contractAddress: string, isSafe: boolean }, ctx) => {
		const client = inject<GovernanceClient>(GovernanceClient);
		await client.reloadTransactions(
			ctx.dispatch, payload.network, payload.contractAddress, payload.isSafe);
});

export function ContractLoader(params:
		{ network: string, contractAddress: string, contractId: string, isSafe: boolean}) {
	const { network, contractAddress, contractId, isSafe } = params;
	const initialized = useSelector<GovernanceAppState, boolean>(
		state => state.data.init.initialized);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const dispatch = useDispatch();
	const loadedContract = contract?.id;
	useEffect(() => {
		if (initialized && !!network && !!contractAddress && !!contractId) {
			dispatch(loadContract({network, contractAddress,  contractId, isSafe}));
		}
	}, [initialized, network, contractAddress, contractId]);
	useEffect(() => {
		if (initialized && !!contractAddress && !!network && !!userAddress) {
			dispatch(loadSubscription({
				network, contractAddress, isSafe}));
		}
	}, [initialized, contractAddress, network, userAddress]);
	useEffect(() => {
		if (!!loadedContract && !!userAddress && !!network && !!contractAddress) {
			dispatch(loadTrans({network, contractAddress, isSafe}));
		}
	}, [loadedContract, userAddress, network, contractAddress]);

	return (<> </>);
}

export function GovernanceContractPage() {
	const { network, contractAddress, contractId } = useParams() as any;
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const requests = useSelector<GovernanceAppState, GovernanceTransaction[]>(
		state => state.data.state.requests);
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);

	const history = useHistory();
	const dispatch = useDispatch();
	const isSafe = contract?.identifier?.name.includes('SAFE');
	console.log(quorum, 'quorumquorumquorum')
	//@ts-ignore
	const voteCount = Number(parseInt(quorum?.vetoCount?.hex?.toString(), 16))
	console.log(voteCount, 'voteCountvoteCount')
	return (
		<>
			<div className='gv-section-title'>
				<h3>{`${contract?.identifier?.name} Governance `}</h3>
			</div>
			<ContractLoader
				network={network} contractAddress={contractAddress} contractId={contractId} isSafe={isSafe}
			/>
			<div className="gv-page-content">
				<UserSubscription />
				<div className='column'>
					<h1  className='gv-title'><u>Selected Contract</u></h1>
					<Card
						title={`${contract?.identifier?.name} (Version ${contract?.identifier?.version})`}
						subTitle={`${network}:${contractAddress}`}
					>
						<div className='gv-card-action-btn'>
							<FButton title={'New Request'} disabled={!quorum.quorum} onClick={() =>  history.push(`/newMethod/${network}/${contractAddress}/${contractId}`)}/>
						</div>
					</Card>
				</div>
				<div className='column flex'>
					<h1 className='gv-title'><u>Current Requests</u></h1>
					<div className='flex'>
						{requests.map((r, i) => (
							<ChainEventItem
								id={r.execution.transactions[(r.execution?.transactions?.length - 1) || 0]?.transactionId}
								initialStatus={"pending"}
								eventType={'EXECUTION_ITEM'}
								updater={(item) => dispatch(
									updateTransaction(
										item,
										dispatch,
										contractAddress,
										r.requestId,
										r.execution.transactions[0]?.transactionId,
										r.execution.status,
										isSafe
									)
								)}
								network={network}
							>
								<Card key={i}
									title={`${r.method}(${argList(contract.methods.find(m => m.name === r.method))})`}
									subTitle={''}
								>
									<div className="method-contract">
										<p>{r.values.join(', ')}</p>
										<p>{r.network} {r.signatures.length} of {quorum.minSignatures} Signatures</p>
										{(isSafe && voteCount >= 1)  && <p>{r.network} {r.vetoSignatures.length} of {1} Required Veto Signatures Provided</p>}
										<p className='item-actions'>{
											r.signatures.length >= quorum.minSignatures && (
												(
													(r.execution?.status === 'sucess') ? 
													(
														<span>Complete and submitted</span>
													) : (
														<div className='gv-card-action-btn'>
															<FButton
																disabled={
																	(isSafe && voteCount >= 1) && (r.vetoSignatures.length < 1) ||
																	r.execution.status === "successful" as any
																}
																title={
																	(r.execution.status === "successful"  as any) ? 
																	"Transaction Executed"
																	: 'Submit Transaction'
																}
																onClick={() => history.push(`/method/${network}/${contractAddress}/${contractId}/${r.requestId}`)}
															/>
														</div>	
													)
												)
											) 
										}
										{
											(r.signatures || [] as any)
												.find(s => Utils.addressEqual(s.creator, userAddress!)) ?
											'Signed' :
											<div className='gv-card-action-btn'>
												<FButton title={'Sign'} onClick={() => history.push(`/method/${network}/${contractAddress}/${contractId}/${r.requestId}`)}/>
											</div>
										}</p>
									</div>
								</Card>
							</ChainEventItem>
						))}
					</div>
				</div>
			</div>
		</>
	);
}