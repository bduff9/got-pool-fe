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
