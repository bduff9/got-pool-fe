import { Request, Response } from 'express';
import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { S3_URL } from '../api/constants';
import { allCharacters } from '../api/queries';
import { ensureAuthenticated } from '../api/utilities';
import { Authenticated } from '../layouts/authenticated';
import Default from '../layouts/default';

const meta = { title: 'Dashboard' };

class IndexPage extends Component {
	public static async getInitialProps ({
		req,
		res,
	}: {
	req: Request;
	res: Response;
	}): Promise<{}> {
		ensureAuthenticated(req, res);

		return {};
	}

	public render (): JSX.Element {
		return (
			<Authenticated>
				<Default meta={meta}>
					<h1>Dashboard</h1>
					<Query query={allCharacters}>
						{({ loading, error, data: { characters } }) => {
							if (error) return <div>Error loading posts {error}</div>;

							if (loading) return <div>Loading...</div>;

							return (
								<ul>
									{characters.map(
										({
											id,
											img,
											name,
										}: {
										id: string;
										img: string;
										name: string;
										}) => (
											<li key={`character-${id}`}>
												{name}
												<img
													src={`${S3_URL}/images/characters/${img}`}
													alt={name}
												/>
											</li>
										)
									)}
								</ul>
							);
						}}
					</Query>
				</Default>
			</Authenticated>
		);
	}
}

export default IndexPage;
