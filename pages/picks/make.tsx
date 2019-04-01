import { Column, Columns } from 'bloomer';
import React, { Component, ChangeEvent } from 'react';

import { Character, Context } from '../../api/models';
import { MakePicksQuery, MakePicksData } from '../../api/queries';
import { displayError, ensureAuthenticated } from '../../api/utilities';
import CharacterModal from '../../components/character-modal';
import CharacterPickGrid from '../../components/character-pick-grid';
import FilterPicks from '../../components/filter-picks';
import Loading from '../../components/loading';
import MakePicksControls from '../../components/make-picks-controls';
import MyPicks from '../../components/my-picks';
import { Authenticated } from '../../layouts/authenticated';
import Default from '../../layouts/default';

const meta = { title: 'Make Picks' };

interface MakePicksState {
	currentModal: Character | null;
	filterCharacterStr: string;
	isMinified: boolean;
}

class MakePicks extends Component<{}, MakePicksState> {
	public static async getInitialProps ({ req, res }: Context): Promise<{}> {
		ensureAuthenticated(req, res);

		return {};
	}

	public state: MakePicksState = {
		currentModal: null,
		filterCharacterStr: '',
		isMinified: false,
	};

	private _closeModal = (): void => {
		this.setState({ currentModal: null });
	};

	private _filterCharacter = (ev: ChangeEvent<HTMLInputElement>): void => {
		this.setState({ filterCharacterStr: ev.currentTarget.value });
	};

	private _filterCharacters = (character: Character): boolean => {
		const { filterCharacterStr } = this.state;

		if (!filterCharacterStr) return true;

		return (
			character.name.toUpperCase().indexOf(filterCharacterStr.toUpperCase()) >
			-1
		);
	};

	private _pickCharacter = (character: Character | null): void => {
		this.setState({ currentModal: character });
	};

	private _toggleMinification = (): void => {
		this.setState(prevState => ({ isMinified: !prevState.isMinified }));
	};

	public render (): JSX.Element {
		const { currentModal, filterCharacterStr, isMinified } = this.state;

		return (
			<Authenticated>
				<Default meta={meta}>
					<MakePicksQuery>
						{({ data, error, loading }) => {
							if (loading) {
								return <Loading isLoading />;
							}

							if (error || !data) {
								displayError(error ? error.message : 'Error loading data');

								return <div>Something went wrong, please try again later</div>;
							}

							const { characters, currentUser, myPicks }: MakePicksData = data;
							const hasSubmitted = currentUser && currentUser.submitted === 'Y';

							return (
								<Columns isCentered isMultiline>
									<Column isSize={{ desktop: '3/4', mobile: 'full' }}>
										<MyPicks myPicks={myPicks || []} />
									</Column>
									<Column isSize={{ desktop: '1/4', mobile: 'full' }}>
										<MakePicksControls
											hasSubmitted={hasSubmitted}
											picks={myPicks || []}
											tiebreaker={currentUser && currentUser.tiebreaker}
										/>
									</Column>
									<Column isSize="full">
										<FilterPicks
											filterCharacters={this._filterCharacter}
											filterString={filterCharacterStr}
											isMinified={isMinified}
											toggleMinification={this._toggleMinification}
										/>
									</Column>

									<Column isSize="full" isHidden={isMinified}>
										<CharacterPickGrid
											characters={characters.filter(this._filterCharacters)}
											myPicks={myPicks || []}
											pickCharacter={
												hasSubmitted ? () => {} : this._pickCharacter
											}
										/>
										{!hasSubmitted && currentModal && (
											<CharacterModal
												character={currentModal}
												picks={myPicks || []}
												closeModal={this._closeModal}
												pickCharacter={this._pickCharacter}
											/>
										)}
									</Column>
								</Columns>
							);
						}}
					</MakePicksQuery>
				</Default>
			</Authenticated>
		);
	}
}

export default MakePicks;
