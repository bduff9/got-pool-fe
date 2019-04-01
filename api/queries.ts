import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Character, logActions, Log, User, Pick } from './models';

export const allCharacters = gql`
	query allCharacters {
		characters {
			id
			name
			img
			alive
		}
	}
`;

export interface AllCharactersData {
	characters: Character[];
}

export class AllCharactersQuery extends Query<AllCharactersData> {
	public static defaultProps = {
		query: allCharacters,
	};
}

export const currentUser = gql`
	query currentUser {
		currentUser {
			id
			name
			paid
			payment_option
			payment_account
			tiebreaker
			submitted
		}
	}
`;

interface CurrentUserData {
	currentUser: User;
}

export class CurrentUserQuery extends Query<CurrentUserData> {
	public static defaultProps = {
		fetchPolicy: 'cache-and-network',
		query: currentUser,
	};
}

export const makePicks = gql`
	query makePicksScreen {
		characters {
			id
			name
			img
			alive
		}
		currentUser {
			id
			name
			tiebreaker
			submitted
		}
		myPicks {
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

export interface MakePicksData {
	characters: Character[];
	currentUser: User;
	myPicks: Pick[] | null;
}

export class MakePicksQuery extends Query<MakePicksData> {
	public static defaultProps = {
		fetchPolicy: 'cache-and-network',
		query: makePicks,
	};
}

const viewAllPicks = gql`
	query viewAllPicks {
		currentUser {
			id
			name
		}
		totalDead
		users {
			name
			tiebreaker
			picks {
				id
				points
				character {
					id
					name
					img
					alive
				}
			}
			score
		}
	}
`;

interface ViewAllPicksData {
	currentUser: User;
	totalDead: number;
	users: User[];
}

export class ViewAllPicksQuery extends Query<ViewAllPicksData> {
	public static defaultProps = {
		fetchPolicy: 'cache-and-network',
		query: viewAllPicks,
	};
}

const getLogs = gql`
	query getLogs(
		$action: LogActionEnum
		$limit: Int!
		$offset: Int!
		$userID: ID
	) {
		logs(action: $action, limit: $limit, offset: $offset, user_id: $userID) {
			logs {
				id
				user {
					id
					name
				}
				message
				action
				time
			}
			cursor {
				currentPage
				itemsPerPage
				totalPages
			}
		}
	}
`;

export interface GetLogsData {
	logs: {
		logs: Log[];
		cursor: {
			currentPage: number;
			itemsPerPage: number;
			totalPages: number;
		};
	};
}

export interface GetLogsVars {
	action?: typeof logActions[number];
	limit: number;
	offset: number;
	userID?: string;
}

export class GetLogsQuery extends Query<GetLogsData, GetLogsVars> {
	public static defaultProps = {
		fetchPolicy: 'cache-and-network',
		query: getLogs,
	};
}

export const adminUsers = gql`
	query adminUsers {
		adminUsers {
			id
			name
			paid
			payment_option
			payment_account
			submitted
		}
	}
`;

export interface AdminUsersData {
	adminUsers: User[];
}

export class AdminUsersQuery extends Query<AdminUsersData> {
	public static defaultProps = {
		fetchPolicy: 'cache-and-network',
		query: adminUsers,
	};
}
