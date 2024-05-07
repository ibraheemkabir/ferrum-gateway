import { AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import React,{Dispatch, useContext, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApprovalState, AppState } from 'common-containers';
import { Big } from 'big.js';
import { BigUtils, ChainEventBase, inject, Utils } from 'types';
import { ApiClient } from './apiClient';
import { ChainEventItem, } from 'common-containers';
import { UnifyreExtensionWeb3Client } from 'unifyre-extension-web3-retrofit';
import { UnifyreExtensionKitClient } from 'unifyre-extension-sdk';
import { FButton } from "ferrum-design-system";
import { ThemeContext } from 'unifyre-react-helper';

export interface IApprovableButtonWrapperViewProps {
	isApprovalMode: boolean;
	pendingApproval: boolean;
	approvalTransactionId: string;
	error?: string;
	onApproveClick: () => void;
}

export interface IApprovableButtonWrapperOwnProps {
	currency: string;
	contractAddress: string;
	userAddress: string;
	amount: string;
    View: (props: IApprovableButtonWrapperViewProps) => any;
}

function mapStateToProps(state: AppState<any, any, any>): ApprovalState {
	return state.data.approval;
}

export function approvalKey(userAddress: string, contractAddress: string, currency: string) {
	return `${userAddress}|${contractAddress}|${currency}`;
}

export const doGetApproval = createAsyncThunk('approveButton/doGetApproval',
    async (payload: {userAddress: string, contractAddress: string, currency: string}, ctx) => {
	const {userAddress, contractAddress, currency} = payload;
    const client = new ApiClient('https://api-gateway.svcs.ferrumnetwork.io/gateway-backend-prod')
	const allocation = await client.getContractAllocation(userAddress, contractAddress, currency);
	if (!!allocation) {
		ctx.dispatch(approvableButtonSlice.actions.allocationUpdated({
			contractAddress, userAddress, currency, allocation: allocation.allocation }))
	}
});

export const doApprove = createAsyncThunk('approveButton/doApprove',
    async (payload: {userAddress: string, contractAddress: string, currency: string, amount: string}, ctx) => {
		console.log('CTAX', ctx, 'pay', payload, 'AND API')
	const {userAddress, contractAddress, currency, amount} = payload;
	let api = inject<ApiClient>(ApiClient);
	api = inject<ApiClient>(ApiClient);

	console.log('API IS', api)
	const transactionId = await api.setContractAllocation(userAddress, contractAddress, currency, amount);
	if (!!transactionId) {
		ctx.dispatch(approvableButtonSlice.actions.approveTransactionReceived({transactionId}));
	}
});

export const approvableButtonSlice = createSlice({
	name: 'approvableButton',
	initialState: {
		approveTransactionId: '',
		pending: false,
		approvals: {},
	} as ApprovalState,
	reducers: {
        allocationUpdated: (state, action) => {
			const {userAddress, contractAddress, currency, allocation} = action.payload;
			state.approvals[approvalKey(userAddress, contractAddress, currency)] = allocation;
		},
		transactionFailed: (state, action) => {
			state.error = action.payload.message || 'Error while getting transaction';
			state.pending = false;
			state.status = 'failed';
		},
		transactionCompleted: (state, action) => {
			state.error = undefined;
			state.pending = false;
			state.status = 'completed';
		},
		approveTransactionReceived: (state, action) => {
			state.approveTransactionId = action.payload.transactionId;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(doApprove.pending, (state, action) => {
			state.pending = true;
			state.error = undefined;
			state.approveTransactionId = '';
			state.status = 'pending';
		});
		builder.addCase(doApprove.fulfilled, (state, action) => {
			state.pending = false;
			state.error = undefined;
			// state.status = 'completed';
		})
		builder.addCase(doApprove.rejected, (state, action) => {
			state.pending = false;
			console.log('Error running approval', action.payload);
			state.error = (action.payload || {} as any).toString();
			state.status = 'failed';
		})
	}
});

async function updateEvent(dispatch: Dispatch<AnyAction>, e: ChainEventBase): Promise<ChainEventBase> {
	try {
		const connect = inject<UnifyreExtensionWeb3Client>(UnifyreExtensionKitClient);
		const t = await connect.getTransaction(e.id);
		console.log('Checking the transloota ', t)
		if (t &&t.blockNumber) {
			console.log('Translo iso componte ', t)
			dispatch(approvableButtonSlice.actions.transactionCompleted({transactionId: e.id}));
			return {...e, status: 'completed'}; // TODO: Check for failed
		}
		console.log('Noting inderezding ', e)
		return {...e, status: 'pending'};
	} catch(ex) {
		console.error('ApprovableButton.updateEvent', ex, e);
		dispatch(approvableButtonSlice.actions.transactionFailed({message: (ex as any).message}));
		return {...e, status: 'failed'};
	}
}

export function ApprovableButtonWrapper(ownProps: IApprovableButtonWrapperOwnProps) {
    const dispatch = useDispatch();
	const props = useSelector(mapStateToProps);
	const [network,] = Utils.parseCurrency(ownProps.currency || '');
	const {userAddress, contractAddress, currency} = ownProps;
	const {status} = props;
	const currentApproval = props.approvals[approvalKey(userAddress, contractAddress, currency)];

	useEffect(() => {
		if (userAddress && contractAddress && currency && Utils.isCurrencyValid(currency)) {
			dispatch(doGetApproval({userAddress, contractAddress, currency}));
		}
	}, [userAddress, contractAddress, currency, status]);

	return (
		<>
            <ChainEventItem
			id={props.approveTransactionId}
			network={network as any}
			initialStatus={'pending'}
			eventType={'approval'}
			updater={e => updateEvent(dispatch, e)}>
                <ownProps.View
                    isApprovalMode={BigUtils.safeParse(currentApproval).lt(BigUtils.safeParse(ownProps.amount || '0.0001'))}
                    pendingApproval={props.status === 'pending'}
                    approvalTransactionId={props.approveTransactionId}
                    onApproveClick={() => dispatch(doApprove({ ...ownProps }))}
                />
            </ChainEventItem>
		</>
	);
}

//@ts-ignore
const themedStyles = (theme) => ({
    container: {
        width: '100%',
        margin: '0px auto'
    },
    maincontainer: {
        // width: '70%',
        margin: '0px auto'
    },
    btnCont: {
        width: 120,
				height: 50,
    }
})

function ApprovableButtonInternal(props: {disabled: boolean, text: string, onClick: () => void} & IApprovableButtonWrapperViewProps) {

	const disabled = props.pendingApproval || (props.isApprovalMode ? false : props.disabled);
	//@ts-ignore
	const theme = useContext(ThemeContext);
	const styles = themedStyles(theme);   

    return (
		<>
			<FButton
				onClick={() => props.isApprovalMode ? props.onApproveClick() : props.onClick()}
				className={'cr-large-btn'}
				disabled={disabled}
				title={props.isApprovalMode ? 'Approve' : props.text}
			/>
		</>
	);
    
}

export function ApprovableButton(props: {
    disabled: boolean, text: string, onClick: () => void,
    contractAddress: string,
    currency: string,
    userAddress: string,
    amount: string,
} ) {
	return <ApprovableButtonWrapper
		contractAddress={props.contractAddress}
		currency={props.currency}
		userAddress={props.userAddress}
		amount={props.amount}
		// @ts-ignore
		View={(ownProps) => <ApprovableButtonInternal {...ownProps} {...props} />}
	/>
}

