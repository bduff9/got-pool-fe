import React, { Component } from 'react';
import { Box, Button, Column, Columns, Content, Control, Field, FieldBody, FieldLabel, Label, Title } from 'bloomer';

import Default from '../../layouts/default';
import { displayError } from '../globals';
import { addPick, deletePick, updatePick } from '../collections/picks';
import Loading from './Loading';
import CharacterCard from './CharacterCard';
import CharacterModal from './CharacterModal';
import Character from '../collections/characters';
import { writeLog } from '../collections/gotlogs';
import Pick from '../collections/picks';
import { submitPicks } from '../collections/users';

const meta = { title: 'Make Picks' };

class MakePicks extends Component {
	state = {
		filterCharacterStr: '',
		currentModal: null,
		subscriptions: {
			characters: Meteor.subscribe('allCharacters'),
			picks: Meteor.subscribe('myPicks')
		}
	};

	componentWillUnmount () {
		const { characters, picks } = this.state.subscriptions;

		characters.stop();
		picks.stop();
	}

	characters () {
		return Character.find({}, { sort: { name: 1 }}).fetch();
	}

	picks () {
		return Pick.find({ user_id: Meteor.userId() }, { sort: { points: 1 }}).fetch();
	}

	_closeModal (ev) {
		this.setState({ currentModal: null });
	}

	_filterCharacter (ev) {
		this.setState({ filterCharacterStr: ev.currentTarget.value });
	}

	_pickCharacter (character, ev) {
		this.setState({ currentModal: character });
	}

	_setPoints (character_id, points, actionMode, ev) {
		const characterObj = { character_id, points };
		switch (actionMode) {
			case 'add':
				addPick.call(characterObj, displayError);
				break;
			case 'update':
				updatePick.call(characterObj, displayError);
				break;
			case 'delete':
				deletePick.call(characterObj, displayError);
				break;
			default:
				console.error('Invalid action mode passed', actionMode);
				break;
		}
		this.setState({ currentModal: null });
	}

	_submitPicks (ev) {
		const tiebreakerStr = this.tiebreakerInput.value,
				tiebreaker = parseInt(tiebreakerStr, 10),
				totalPicked = this.picks().length;
		if (totalPicked < 7) {
			Bert.alert({
				message: 'You have not selected all 7 picks',
				type: 'danger',
				icon: 'fa-exclamation-triangle'
			});
			return false;
		}
		submitPicks.call({ tiebreaker }, err => {
			if (err) {
				displayError(err, { title: err.reason, type: 'warning' });
			} else {
				Bert.alert({
					message: 'Your picks have been successfully submitted!',
					type: 'success',
					icon: 'fa-thumbs-up'
				});
				writeLog.call({ userId: Meteor.userId(), action: 'SUBMIT_PICKS' }, displayError);
				this.context.router.history.push('/');
			}
		});
	}

	render () {
		const { currentModal, filterCharacterStr, subscriptions } = this.state,
				{ characters, picks } = subscriptions,
				pageReady = characters.ready() && picks.ready();
		return (
			<Default meta={meta}>
				<Loading isLoading={!pageReady}>
					<Box isFullWidth>
						<Content isSize={{ desktop: 'medium' }} hasTextAlign="centered" isPaddingless>
							<Title isSize={4} hasTextColor="danger"><strong>Picks locked when episode 2 begins!</strong></Title>
						</Content>
					</Box>
					<Columns isCentered>
						<Column isSize={{ desktop: '1/2', mobile: 'full' }}>
							<Field isPulled="left">
								<Label>Search </Label>
							</Field>
							<Field>
								<Control isExpanded>
									<input
										className="input"
										type="text"
										placeholder="Search Character Name"
										onChange={this._filterCharacter}
										value={filterCharacterStr}
									/>
								</Control>
							</Field>
						</Column>
						<Column isSize={{ desktop: '1/2', mobile: 'full' }}>
							<Field isPulled="left">
								<Label>Tiebreaker </Label>
							</Field>
							<Field>
								<Control isExpanded>
									<input
										className="input"
										type="number"
										placeholder="Total Characters To Die This Season"
										ref={input => { this.tiebreakerInput = input; }}
									/>
								</Control>
							</Field>
						</Column>
					</Columns>
					<Field >
						<Control>
							<Button isFullWidth isColor="primary" type="button" onClick={this._submitPicks}>Submit Picks</Button>
						</Control>
					</Field>
					<Columns isCentered isMultiline>
						{this.characters().filter(character => !filterCharacterStr || character.name.toUpperCase().indexOf(filterCharacterStr.toUpperCase()) > -1).map(character => (
							<Column isSize={{ default: '1/4', tablet: '1/2', mobile: 'full' }} key={`character${character._id}`}>
								<CharacterCard character={character} picks={this.picks()} pickCharacter={this._pickCharacter.bind(null, character)} />
							</Column>
						))}
						{currentModal ? <CharacterModal character={currentModal} picks={this.picks()} closeModal={this._closeModal} setPoints={this._setPoints} /> : null}
					</Columns>
				</Loading>
			</Default>
		);
	}
}

export default MakePicks;
