import { Control, Input } from 'bloomer';
import React, { FocusEvent } from 'react';

import { ChangeTiebreakerMutation } from '../api/mutations';
import { MakePicksData, makePicks } from '../api/queries';
import { displayError } from '../api/utilities';

interface SetTiebreakerProps {
	tiebreaker: number | null;
}

const SetTiebreaker = ({ tiebreaker }: SetTiebreakerProps): JSX.Element => (
	<ChangeTiebreakerMutation
		update={(cache, { data }) => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData && data) {
				const { characters, currentUser, myPicks } = cachedData;
				const { changeTiebreaker: tiebreaker } = data;

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: {
						characters,
						currentUser: { ...currentUser, tiebreaker },
						myPicks,
					},
				});
			}
		}}
	>
		{(mutate, { error, loading }) => {
			const updateTiebreaker = (ev: FocusEvent<HTMLInputElement>): void => {
				const tiebreakerStr = ev.currentTarget.value;
				const tiebreaker =
					tiebreakerStr === '' ? null : parseInt(tiebreakerStr, 10);

				mutate({ variables: { tiebreaker } });
			};

			if (error) displayError(error.message);

			return (
				<Control isExpanded key={`tiebreaker-${tiebreaker}`}>
					<Input
						defaultValue={`${tiebreaker || ''}`}
						disabled={loading}
						placeholder="Total Characters To Die This Season"
						type="number"
						onBlur={updateTiebreaker}
					/>
				</Control>
			);
		}}
	</ChangeTiebreakerMutation>
);

export default SetTiebreaker;
