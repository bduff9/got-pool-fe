import {
	Control,
	Field,
	FieldBody,
	FieldLabel,
	Input,
	Label,
	Button,
} from 'bloomer';
import React from 'react';

import { pointArr } from '../api/models';
import { displayError } from '../api/utilities';

interface MakePicksControlsProps {
	hasSubmitted: boolean;
	tiebreaker: typeof pointArr[number];
}

const MakePicksControls = ({
	hasSubmitted,
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
					<Label>Tiebreaker</Label>
				</FieldLabel>
				<FieldBody>
					<Field isGrouped>
						<Control isExpanded>
							<Input
								type="number"
								placeholder="Total Characters To Die This Season"
								value={tiebreaker}
							/>
						</Control>
					</Field>
				</FieldBody>
			</Field>

			<Field isGrouped isPulled="right">
				<Control>
					<Button
						isColor="warning"
						type="button"
						onClick={ev => console.log(ev)}>
						Reset
					</Button>
				</Control>
				<Control>
					<Button isColor="primary" type="button" onClick={_displaySaveMessage}>
						Save
					</Button>
				</Control>
				<Control>
					<Button
						isFullWidth
						isColor="info"
						type="button"
						onClick={ev => console.log(ev)}>
						Submit
					</Button>
				</Control>
			</Field>
		</div>
	);
};

export default MakePicksControls;
