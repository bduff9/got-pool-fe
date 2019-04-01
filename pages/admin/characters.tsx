import React, { Component } from 'react';

import { Context, Character } from '../../api/models';
import { AllCharactersQuery } from '../../api/queries';
import { displayError, ensureAuthenticated } from '../../api/utilities';
import CharactersTable from '../../components/characters-table';
import Loading from '../../components/loading';
import { Authenticated } from '../../layouts/authenticated';
import Default from '../../layouts/default';

const meta = { title: 'Admin Characters' };

class AdminCharacters extends Component<{}, {}> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: Context): Promise<{}> {
		ensureAuthenticated(req, res);

		return query;
	}

	public render (): JSX.Element {
		return (
			<Authenticated>
				<Default meta={meta}>
					<AllCharactersQuery>
						{({ data, error, loading }) => {
							let characters: Character[] = [];

							if (loading) return <Loading isLoading />;

							if (error) {
								displayError(error.message);

								return <div>Something went wrong, please try again later</div>;
							}

							if (data && data.characters) characters = data.characters;

							return <CharactersTable characters={characters} />;
						}}
					</AllCharactersQuery>
				</Default>
			</Authenticated>
		);
	}
}

export default AdminCharacters;
