import { Table, Title, Columns, Column } from 'bloomer';
import React from 'react';

import Loading from './loading';

import { ViewAllPicksQuery } from '../api/queries';
import { displayError } from '../api/utilities';
import CharacterCard from './character-card';
import { Pick } from '../api/models';

const ViewAllPicks = (): JSX.Element => (
	<ViewAllPicksQuery>
		{({ data, error, loading }) => {
			if (loading) return <Loading isLoading />;

			if (error || !data) {
				error && displayError(error.message);

				return (
					<Title>
						Something went wrong when loading, please try again later
					</Title>
				);
			}

			const { currentUser, totalDead, users } = data;
			const sortedUsers = [...users].sort(
				(user1, user2): number => {
					const tiebreaker1 = totalDead - (user1.tiebreaker || 0);
					const tiebreaker2 = totalDead - (user2.tiebreaker || 0);

					if (user1.score > user2.score) return -1;

					if (user1.score < user2.score) return 1;

					if (tiebreaker1 < 0 && tiebreaker2 >= 0) return 1;

					if (tiebreaker1 >= 0 && tiebreaker2 < 0) return -1;

					return Math.abs(tiebreaker1) - Math.abs(tiebreaker2);
				},
			);
			let lastUser: {
				lastPlace: number;
				lastScore: number | null;
				lastTiebreaker: number;
			} = { lastPlace: 0, lastScore: null, lastTiebreaker: 0 };

			const getPlace = ({
				score,
				tiebreaker,
			}: {
				score: number;
				tiebreaker: number | null;
			}): number => {
				const { lastPlace, lastScore, lastTiebreaker } = lastUser;
				const thisTiebreaker = totalDead - (tiebreaker || 0);
				let thisPlace = lastPlace;

				if (lastScore === null || totalDead === 0) {
					thisPlace = 1;
				} else if (score < lastScore) {
					thisPlace = lastPlace + 1;
				} else if (Math.abs(thisTiebreaker) > Math.abs(lastTiebreaker)) {
					thisPlace = lastPlace + 1;
				}

				lastUser = {
					lastPlace: thisPlace,
					lastScore: score,
					lastTiebreaker: thisTiebreaker,
				};

				return thisPlace;
			};

			const sortPicks = (pick1: Pick, pick2: Pick): number =>
				pick2.points - pick1.points;

			return (
				<Table isBordered isStriped className="full-width">
					<thead>
						<tr className="nowrap">
							<th className="shrink">#</th>
							<th className="shrink">Name</th>
							<th className="shrink">Score</th>
							<th className="shrink">Tiebreaker</th>
							<th>Picks</th>
						</tr>
					</thead>
					<tbody>
						{sortedUsers.map(({ name, picks, score, tiebreaker }) => {
							const sortedPicks = [...picks].sort(sortPicks);

							return (
								<tr
									className={currentUser.name === name ? 'is-selected' : ''}
									key={`user-${name}`}
								>
									<td>{getPlace({ score, tiebreaker })}</td>
									<td className="nowrap">{name}</td>
									<td>{score}</td>
									<td>
										{tiebreaker} / {totalDead}
									</td>
									<td className="is-hidden-tablet">
										{sortedPicks.map(pick => (
											<p
												className={`nowrap text-only${
													pick.character.alive === 'N' ? ' dead' : undefined
												}`}
												key={`text-pick-${pick.id}`}
											>
												{`${pick.points} ${pick.character.name}`}
											</p>
										))}
									</td>
									<td className="is-hidden-mobile">
										<Columns>
											{sortedPicks.map(pick => (
												<Column key={`pick-${pick.id}`}>
													<CharacterCard
														character={pick.character}
														isMini
														picks={picks}
													/>
												</Column>
											))}
										</Columns>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			);
		}}
	</ViewAllPicksQuery>
);

export default ViewAllPicks;
