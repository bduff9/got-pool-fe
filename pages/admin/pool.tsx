import React, { Component } from 'react';
import { Button, Table } from 'bloomer';

import Default from '../../layouts/default';
import { displayError } from '../globals';
import Loading from './loading';
import Character, { toggleCharacterAlive } from '../collections/characters';

const meta = { title: 'Update Pool' };

class AdminPool extends Component {
	state = {
		subscriptions: {
			characters: Meteor.subscribe('allCharacters')
		}
	};

	componentWillUnmount () {
		const { characters } = this.state.subscriptions;

		characters.stop();
	}

	characters () {
		return Character.find({}, { sort: { name: 1 }}).fetch();
	}

	_toggleStatus (character_id, ev) {
		toggleCharacterAlive.call({ character_id }, displayError);
	}

	render () {
		const { subscriptions } = this.state,
				{ characters } = subscriptions,
				pageReady = characters.ready();

		return (
			<Default meta={meta}>
				<Loading isLoading={!pageReady}>
					<Table>
						<thead>
							<tr>
								<th>Character</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{this.characters().map(character => (
								<tr key={`character${character._id}`}>
									<td className={(character.isAlive ? '' : 'dead')}>{character.name}</td>
									<td>
										<Button isColor={character.isAlive ? 'danger' : 'success'} onClick={this._toggleStatus.bind(null, character._id)}>
											{character.isAlive ? 'Mark Dead' : 'Mark Alive'}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</Loading>
			</Default>
		);
	}
}

export default AdminPool;
