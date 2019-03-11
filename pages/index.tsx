import React, { Component } from 'react';
import { Query } from 'react-apollo';

import { S3_URL } from '../api/constants';
import { allCharacters } from '../api/queries';
import Default from '../layouts/default';

const meta = { title: 'Dashboard' };

class IndexPage extends Component {
	static async getInitialProps () {
		return {};
	}

	state = {};

	render () {
		return (
			<Default meta={meta}>
				<div>
					<h1>Dashboard</h1>
					<Query query={allCharacters}>
						{({ loading, error, data: { characters } }) => {
							if (error) return <div>Error loading posts {error}</div>
							if (loading) return <div>Loading...</div>;

							return (
								<ul>
									{characters.map(({ id, img, name }) => <li key={`character-${id}`}>
										{name}
										<img src={`${S3_URL}/images/characters/${img}`} alt={name} />
									</li>)}
								</ul>
							);
						}}
					</Query>
				</div>
			</Default>
		);
	}
}

export default IndexPage;
