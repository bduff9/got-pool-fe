import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Control, Field, FieldBody, FieldLabel, Label } from 'bloomer';
import React, { MouseEvent, useEffect } from 'react';

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

let hasShownHelp = false;

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

	const _getHelp = (ev?: MouseEvent<HTMLButtonElement>): void => {
		if (!ev && hasShownHelp) return;

		hasShownHelp = true;

		displayError(
			'Click each character image to assign them a point value on confidence they will die (7 is most confident, 1 is least confident)',
			{ type: 'success' },
		);
	};

	useEffect(() => {
		if (!hasSubmitted) _getHelp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
					<Control>
						<Button isColor="text" onClick={_getHelp}>
							<FontAwesomeIcon icon="question-circle" />
						</Button>
					</Control>
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
