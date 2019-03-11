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
