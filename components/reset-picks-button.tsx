import { Button, Control } from 'bloomer';
import React from 'react';

import { ResetPicksMutation } from '../api/mutations';
import { makePicks, MakePicksData } from '../api/queries';
import { displayError } from '../api/utilities';

const ResetPicksButton = (): JSX.Element => (
	<ResetPicksMutation
		update={cache => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData) {
				const { characters, currentUser } = cachedData;

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: {
						characters,
						currentUser: { ...currentUser, tiebreaker: null },
						myPicks: [],
					},
				});
			}
		}}>
		{(mutate, { error, loading }) => {
			const resetPicks = (): void => {
				mutate().catch(err => displayError(err));
			};

			if (error) displayError(error.message);

			return (
				<Control>
					<Button
						isColor="warning"
						isLoading={loading}
						type="button"
						onClick={resetPicks}>
						Reset
					</Button>
				</Control>
			);
		}}
	</ResetPicksMutation>
);

export default ResetPicksButton;
