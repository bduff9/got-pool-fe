import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Pick, pointArr, User, paymentTypes, Character, yesNo } from './models';

const registerUser = gql`
	mutation registerUser(
		$userID: String!
		$fullName: String!
		$paymentOption: PaymentEnum!
		$paymentAccount: String
	) {
		addUser(
			id: $userID
			name: $fullName
			paymentOption: $paymentOption
			account: $paymentAccount
		) {
			id
		}
	}
`;

export interface RegisterUserData {
	addUser: { id: string };
}

export interface RegisterUserVars {
	userID: string;
	fullName: string;
	paymentOption: typeof paymentTypes[number];
	paymentAccount: string | null;
}

export class RegisterUserMutation extends Mutation<
	RegisterUserData,
	RegisterUserVars
> {
	public static defaultProps = {
		mutation: registerUser,
	};
}

const writeLog = gql`
	mutation writeLog(
		$userID: String
		$message: String!
		$action: LogActionEnum!
	) {
		logAction(user_id: $userID, message: $message, action: $action) {
			id
		}
	}
`;

export interface Write404LogData {
	logAction: { id: number };
}

export interface Write404LogVars {
	action: '_404';
	message: string;
}

export class Write404LogMutation extends Mutation<
	Write404LogData,
	Write404LogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: '_404' },
	};
}

export interface WriteLoginLogData {
	id: string;
}

export interface WriteLoginLogVars {
	action: 'LOGIN';
	message: string;
	userID: string | null;
}

export class WriteLoginLogMutation extends Mutation<
	WriteLoginLogData,
	WriteLoginLogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: 'LOGIN' },
	};
}

interface WriteLogoutLogData {
	id: string;
}

interface WriteLogoutLogVars {
	action: 'LOGOUT';
	message: string;
	userID: string;
}

export class WriteLogoutLogMutation extends Mutation<
	WriteLogoutLogData,
	WriteLogoutLogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: 'LOGOUT' },
	};
}

interface WritePaidLogData {
	id: string;
}

interface WritePaidLogVars {
	action: 'PAID';
	message: string;
	userID: string;
}

export class WritePaidLogMutation extends Mutation<
	WritePaidLogData,
	WritePaidLogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: 'PAID' },
	};
}

export interface WriteRegisterLogData {
	id: string;
}

export interface WriteRegisterLogVars {
	action: 'REGISTER';
	message: string;
	userID: string;
}

export class WriteRegisterLogMutation extends Mutation<
	WriteRegisterLogData,
	WriteRegisterLogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: 'REGISTER' },
	};
}

export interface WriteSubmitPicksLogData {
	id: string;
}

export interface WriteSubmitPicksLogVars {
	action: 'SUBMIT_PICKS';
	message: string;
}

export class WriteSubmitPicksLogMutation extends Mutation<
	WriteSubmitPicksLogData,
	WriteSubmitPicksLogVars
> {
	public static defaultProps = {
		mutation: writeLog,
		variables: { action: 'SUBMIT_PICKS' },
	};
}

const changeTiebreaker = gql`
	mutation changeTiebreaker($tiebreaker: Int) {
		changeTiebreaker(tiebreaker: $tiebreaker)
	}
`;

interface ChangeTiebreakerData {
	changeTiebreaker: number | null;
}

interface ChangeTiebreakerVars {
	tiebreaker: number | null;
}

export class ChangeTiebreakerMutation extends Mutation<
	ChangeTiebreakerData,
	ChangeTiebreakerVars
> {
	public static defaultProps = {
		mutation: changeTiebreaker,
	};
}

const resetPicks = gql`
	mutation resetPicks {
		resetPicks {
			id
		}
		changeTiebreaker(tiebreaker: null)
	}
`;

interface ResetPicksData {
	resetPicks: Pick[];
	changeTiebreaker: number | null;
}

export class ResetPicksMutation extends Mutation<ResetPicksData> {
	public static defaultProps = {
		mutation: resetPicks,
	};
}

const addPick = gql`
	mutation addPick($characterID: ID!, $points: Int) {
		addPick(character_id: $characterID, points: $points) {
			id
			points
			character {
				id
				name
				img
				alive
			}
		}
	}
`;

interface AddPickData {
	addPick: Pick;
}

interface AddPickVars {
	characterID: string | number;
	points: typeof pointArr[number];
}

export class AddPickMutation extends Mutation<AddPickData, AddPickVars> {
	public static defaultProps = {
		mutation: addPick,
	};
}

const deletePick = gql`
	mutation deletePick($pickID: ID!) {
		deletePick(id: $pickID)
	}
`;

interface DeletePickData {
	deletePick: number;
}

interface DeletePickVars {
	pickID: string | number;
}

export class DeletePickMutation extends Mutation<
	DeletePickData,
	DeletePickVars
> {
	public static defaultProps = {
		mutation: deletePick,
	};
}

const updatePick = gql`
	mutation updatePick($pickID: ID!, $characterID: ID!, $points: Int) {
		updatePick(id: $pickID, character_id: $characterID, points: $points) {
			id
			points
			character {
				id
				name
				img
				alive
			}
		}
	}
`;

interface UpdatePickData {
	updatePick: Pick;
}

interface UpdatePickVars {
	pickID: string | number;
	characterID: string | number;
	points: typeof pointArr[number];
}

export class UpdatePickMutation extends Mutation<
	UpdatePickData,
	UpdatePickVars
> {
	public static defaultProps = {
		mutation: updatePick,
	};
}

const submitPicks = gql`
	mutation submitPicks {
		submitPicks {
			id
			submitted
			tiebreaker
		}
	}
`;

export interface SubmitPicksData {
	submitPicks: User;
}

export class SubmitPicksMutation extends Mutation<SubmitPicksData> {
	public static defaultProps = {
		mutation: submitPicks,
	};
}

const toggleCharacterAlive = gql`
	mutation toggleCharacterAlive($characterID: ID!, $markAlive: YesNoEnum!) {
		toggleCharacterAlive(id: $characterID, alive: $markAlive) {
			id
			name
			img
			alive
		}
	}
`;

interface ToggleCharacterAliveData {
	toggleCharacterAlive: Character;
}

interface ToggleCharacterAliveVars {
	characterID: number;
	markAlive: typeof yesNo[number];
}

export class ToggleCharacterAliveMutation extends Mutation<
	ToggleCharacterAliveData,
	ToggleCharacterAliveVars
> {
	public static defaultProps = {
		mutation: toggleCharacterAlive,
	};
}
