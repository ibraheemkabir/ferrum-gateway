import { addressForUser } from 'common-containers';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { GovernanceContract, QuorumSubscription } from 'types';
import { GovernanceAppState } from '../common/GovernanceAppState';
import { Card } from '../components/Card';

export function UserSubscription() {
	const { contractAddress } = useParams() as any;
	const userAddress = useSelector<GovernanceAppState, string|undefined>(
		state => addressForUser(state.connection.account.user)?.address);
	const contract = useSelector<GovernanceAppState, GovernanceContract>(
		state => state.data.state.selectedContract);
	const quorum = useSelector<GovernanceAppState, QuorumSubscription>(
		state => state.connection.userState.quorum);
	
	const isSafe = contract?.identifier?.name.includes('SAFE');
	//@ts-ignore
	const vetoRightsLength = parseInt(quorum?.vetoCount?.hex?.toString(), 16) || 0
	return (
		<>
		<Card title={'Connected Account'} subTitle=''>
			<div className="method-contract">
				<h4><div className='title-mini'>Your address:</div> {userAddress || 'Not connected'}</h4>
				<h4><div className='title-mini'>Contract:</div> {contract.id}</h4>
				<h4><div className='title-mini'>At:</div> {contractAddress}</h4>
				<h4><div className='title-mini'>Quorum:</div> {quorum.quorum || 'Not registered'}</h4>
				{/* //<h4><div className='title-mini'>Group ID:</div> {quorum.groupId.hex as any}</h4> */}
				<h4><div className='title-mini'>Min signatures:</div> {quorum?.minSignatures}</h4>
				{ isSafe && <h4><div className='title-mini'>Veto rights length:</div>{vetoRightsLength}</h4>}
			</div>
		</Card>
		</>
	);
}