import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const registerUser = gql`
	mutation registerUser(
		$user_id: String!
		$full_name: String!
		$payment_option: PaymentEnum!
		$payment_account: String
	) {
		addUser(
			id: $user_id
			name: $full_name
			paymentOption: $payment_option
			account: $payment_account
		) {
			id
		}
	}
`;

export const registerUserWrapper = graphql(registerUser, {
	props: ({ mutate }) => ({
		registerUser: (
			userID: string,
			fullName: string,
			paymentOption: string,
			account?: string
		) =>
			mutate({
				variables: {
					user_id: userID,
					full_name: fullName,
					payment_option: paymentOption,
					payment_account: account,
				},
			}),
	}),
});

const writeLog = gql`
	mutation writeLog(
		$user_id: String
		$message: String!
		$action: LogActionEnum!
	) {
		logAction(user_id: $user_id, message: $message, action: $action) {
			id
		}
	}
`;

export const write404LogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		write404Log: (url: string, userID?: string) =>
			mutate({ variables: { action: '_404', message: url, user_id: userID } }),
	}),
});

export const writeLoginLogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		writeLoginLog: (userID: string | null, message: string = '') =>
			mutate({ variables: { action: 'LOGIN', message, user_id: userID } }),
	}),
});

export const writeLogoutLogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		writeLogoutLog: (userID: string) =>
			mutate({ variables: { action: 'LOGOUT', message: '', user_id: userID } }),
	}),
});

export const writePaidLogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		writePaidLog: (userID: string, paid: number) =>
			mutate({
				variables: {
					action: 'PAID',
					message: `Paid $${paid}`,
					user_id: userID,
				},
			}),
	}),
});

export const writeRegisterLogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		writeRegisterLog: (userID: string) =>
			mutate({
				variables: { action: 'REGISTER', message: '', user_id: userID },
			}),
	}),
});

export const writeSubmitPicksLogWrapper = graphql(writeLog, {
	props: ({ mutate }) => ({
		writeSubmitPicksLog: (userID: string) =>
			mutate({
				variables: { action: 'SUBMIT_PICKS', message: '', user_id: userID },
			}),
	}),
});
