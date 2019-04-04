import { Control, Field, FieldBody, FieldLabel, Label, Button } from 'bloomer';
import React from 'react';

import ResetPicksButton from './reset-picks-button';
import SetTiebreaker from './set-tiebreaker';
import SubmitPicksButton from './submit-picks-button';

import { Pick } from '../api/models';
import { displayError } from '../api/utilities';

interface MakePicksControlsProps {
	hasSubmitted: boolean;
	picks: Pick[];
	tiebreaker: number | null;
}

const MakePicksControls = ({
	hasSubmitted,
	picks,
	tiebreaker,
}: MakePicksControlsProps): JSX.Element => {
	const _displaySaveMessage = (): void => {
		displayError('Your picks have been successfully saved!', {
			type: 'success',
		});
	};

	return (
		<div>
			<Field isHorizontal>
				<FieldLabel isNormal>
					<Label
						title="How many total characters from the list below will die this season (0 or more)?"
						style={{ cursor: 'help' }}
					>
						Tiebreaker
					</Label>
				</FieldLabel>
				{hasSubmitted ? (
					<FieldLabel isNormal>
						<Label>{tiebreaker}</Label>
					</FieldLabel>
				) : (
					<FieldBody>
						<Field isGrouped>
							<SetTiebreaker tiebreaker={tiebreaker} />
						</Field>
					</FieldBody>
				)}
			</Field>

			{!hasSubmitted && (
				<Field isGrouped isPulled="right">
					<ResetPicksButton />
					<Control>
						<Button
							isColor="primary"
							type="button"
							onClick={_displaySaveMessage}
						>
							Save
						</Button>
					</Control>
					<SubmitPicksButton picks={picks} tiebreaker={tiebreaker} />
				</Field>
			)}
		</div>
	);
};

export default MakePicksControls;
