import { Button, Control } from 'bloomer';
import React from 'react';
import { adopt } from 'react-adopt';
import { MutationFn, MutationResult } from 'react-apollo';

import { Pick, pointArr, RenderProp } from '../api/models';
import {
	SubmitPicksMutation,
	WriteSubmitPicksLogMutation,
	SubmitPicksData,
	WriteSubmitPicksLogData,
	WriteSubmitPicksLogVars,
} from '../api/mutations';
import { MakePicksData, makePicks } from '../api/queries';
import { displayError } from '../api/utilities';

interface SubmitPicksButtonProps {
	picks: Pick[];
	tiebreaker: number | null;
}

interface SubmitPicksButtonRenderProps {
	submitPicks: {
		mutation: MutationFn<SubmitPicksData>;
		result: MutationResult<SubmitPicksData>;
	};
	writeSubmittedPicksLog: {
		mutation: MutationFn<WriteSubmitPicksLogData, WriteSubmitPicksLogVars>;
		result: MutationResult<WriteSubmitPicksLogData>;
	};
}

const submitPicks = ({ render }: RenderProp): JSX.Element => (
	<SubmitPicksMutation
		update={cache => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData) {
				const { characters, currentUser, myPicks } = cachedData;

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: {
						characters,
						currentUser: { ...currentUser, submitted: 'Y' },
						myPicks,
					},
				});
			}
		}}
	>
		{(mutation, result) => render && render({ mutation, result })}
	</SubmitPicksMutation>
);

const writeSubmittedPicksLog = ({ render }: RenderProp): JSX.Element => (
	<WriteSubmitPicksLogMutation>
		{(mutation, result) => render && render({ mutation, result })}
	</WriteSubmitPicksLogMutation>
);

const Composed = adopt<SubmitPicksButtonRenderProps, {}>({
	submitPicks,
	writeSubmittedPicksLog,
});

const SubmitPicksButton = ({
	picks,
	tiebreaker,
}: SubmitPicksButtonProps): JSX.Element => (
	<Composed>
		{({ submitPicks, writeSubmittedPicksLog }) => {
			const submitPicksFn = (): void => {
				const picksUsed = picks.map(({ points }) => points);

				if (picksUsed.length !== 7) {
					displayError('You must make all 7 picks before you can submit');

					return;
				}

				for (let i = pointArr.length; i--; null) {
					const point = pointArr[i];
					const firstUsed = picksUsed.indexOf(point);

					if (firstUsed === -1) {
						displayError(`You have not used your ${point} pick yet`);

						return;
					}

					if (firstUsed !== picksUsed.lastIndexOf(point)) {
						displayError(
							`You have used pick ${point} more than once, please resolve to submit`,
						);

						return;
					}
				}

				if (tiebreaker == null || tiebreaker < 0) {
					displayError(
						'Please enter a valid tiebreaker value of total main characters to die this season (0 or more)',
					);

					return;
				}

				submitPicks
					.mutation()
					.then(() =>
						writeSubmittedPicksLog.mutation({
							variables: { action: 'SUBMIT_PICKS', message: '' },
						}),
					)
					.then(() => {
						displayError(
							'You have successfully submitted your picks.  Best of luck to thee!',
							{ type: 'success' },
						);
					})
					.catch(err => displayError(err));
			};

			const {
				error: submitPicksError,
				loading: submitPicksLoading,
			} = submitPicks.result;
			const {
				error: writeLogError,
				loading: writeLogLoading,
			} = writeSubmittedPicksLog.result;

			if (submitPicksError) displayError(submitPicksError.message);

			if (writeLogError) displayError(writeLogError.message);

			return (
				<Control>
					<Button
						isColor="info"
						isFullWidth
						isLoading={submitPicksLoading || writeLogLoading}
						type="button"
						onClick={submitPicksFn}
					>
						Submit
					</Button>
				</Control>
			);
		}}
	</Composed>
);

export default SubmitPicksButton;
