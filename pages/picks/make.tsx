import { Column, Columns } from 'bloomer';
import { Request, Response } from 'express';
import Router from 'next/router';
import React, {
	Component,
	ChangeEvent,
	MouseEvent,
	createRef,
	RefObject,
} from 'react';

import { Character, User, Pick } from '../../api/models';
import { writeSubmitPicksLogWrapper } from '../../api/mutations';
import { displayError, ensureAuthenticated } from '../../api/utilities';
import Loading from '../../components/loading';
import CharacterModal from '../../components/character-modal';
import { Authenticated } from '../../layouts/authenticated';
import Default from '../../layouts/default';
import { FetchResult, Query } from 'react-apollo';
import { makePicks } from '../../api/queries';
import MyPicks from '../../components/my-picks';
import MakePicksControls from '../../components/make-picks-controls';
import FilterPicks from '../../components/filter-picks';
import CharacterPickGrid from '../../components/character-pick-grid';

const meta = { title: 'Make Picks' };

class MakePicks extends Component<
	{
		writeSubmitPicksLog: (
			userID: string
		) => Promise<void | FetchResult<
	{},
	Record<string, any>,
	Record<string, any>
	>>;
	},
	{
		currentModal: Character | null;
		filterCharacterStr: string;
		isMinified: boolean;
	}
	> {
	private tiebreakerInputRef: RefObject<HTMLInputElement> = createRef();

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

	public state: {
		currentModal: Character | null;
		filterCharacterStr: string;
		isMinified: boolean;
	} = {
		currentModal: null,
		filterCharacterStr: '',
		isMinified: false,
	};

	private _closeModal = (ev: MouseEvent<HTMLElement>): void => {
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

	private _pickCharacter = (character: Character): void => {
		this.setState({ currentModal: character });
	};

	private _setPoints = (
		characterID: number,
		points: number,
		actionMode: 'add' | 'update' | 'delete'
	): void => {
		const characterObj = { characterID, points };

		switch (actionMode) {
			case 'add':
				console.log(`addPick.call(${characterObj}, displayError);`);
				break;
			case 'update':
				console.log(`updatePick.call(${characterObj}, displayError);`);
				break;
			case 'delete':
				console.log(`deletePick.call(${characterObj}, displayError);`);
				break;
			default:
				console.error('Invalid action mode passed', actionMode);
				break;
		}

		this.setState({ currentModal: null });
	};

	private _submitPicks = (ev: MouseEvent): false => {
		const userID = '';
		const { writeSubmitPicksLog } = this.props;
		const { current } = this.tiebreakerInputRef;
		const tiebreakerStr = (current && current.value) || '0';
		const tiebreaker = parseInt(tiebreakerStr, 10);
		const totalPicked = this.picks().length;

		if (totalPicked < 7) {
			displayError('You have not selected all 7 picks', { type: 'warning' });

			return false;
		}

		submitPicks.call({ tiebreaker }, (err: Error) => {
			if (err) {
				displayError(err.message, { type: 'error' });
			} else {
				displayError('Your picks have been successfully submitted!', {
					type: 'success',
				});
				writeSubmitPicksLog(userID).catch(displayError);

				Router.push('/');
			}
		});

		return false;
	};

	private _toggleMinification = (): void => {
		this.setState(prevState => ({ isMinified: !prevState.isMinified }));
	};

	public render (): JSX.Element {
		const { currentModal, filterCharacterStr, isMinified } = this.state;

		return (
			<Authenticated>
				<Default meta={meta}>
					<Query query={makePicks}>
						{({ data, error, loading }) => {
							const {
								characters,
								currentUser,
								myPicks,
							}: {
								characters: Character[];
								currentUser: User;
								myPicks: Pick[];
							} = data;

							if (loading) {
								return <Loading isLoading />;
							}

							if (error) {
								displayError(error.message);

								return <div>Something went wrong, please try again later</div>;
							}

							console.log({ data, error, loading });

							return (
								<Columns isCentered isMultiline>
									<Column isSize={{ desktop: '3/4', mobile: 'full' }}>
										<MyPicks myPicks={myPicks} />
									</Column>
									<Column isSize={{ desktop: '1/4', mobile: 'full' }}>
										<MakePicksControls
											hasSubmitted={currentUser.submitted === 'Y'}
											tiebreaker={currentUser.tiebreaker}
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
											myPicks={myPicks}
											pickCharacter={this._pickCharacter}
										/>
										{currentModal && (
											<CharacterModal
												character={currentModal}
												picks={data.myPicks}
												closeModal={this._closeModal}
												setPoints={this._setPoints}
											/>
										)}
									</Column>
								</Columns>
							);
						}}
					</Query>
				</Default>
			</Authenticated>
		);
	}
}

export default writeSubmitPicksLogWrapper(MakePicks);
