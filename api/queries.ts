import gql from 'graphql-tag';

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
