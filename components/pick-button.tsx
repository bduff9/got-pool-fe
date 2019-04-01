import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Control } from 'bloomer';
import React from 'react';

import { pointArr, Pick, Character } from '../api/models';
import {
	AddPickMutation,
	DeletePickMutation,
	UpdatePickMutation,
} from '../api/mutations';
import { makePicks, MakePicksData } from '../api/queries';
import { displayError } from '../api/utilities';

interface PickButtonProps {
	characterPick: Pick | null;
	currentCharacter: Character;
	point: typeof pointArr[number];
	usedPoints: typeof pointArr[number][];
	pickCharacter: (character: Character | null) => void;
}

const PickButton = ({
	characterPick,
	currentCharacter,
	point,
	usedPoints,
	pickCharacter,
}: PickButtonProps): JSX.Element => {
	const pointUsed = usedPoints.indexOf(point) > -1;

	if (characterPick && characterPick.points === point)
		return (
			<DeletePickButton
				pick={characterPick}
				point={point}
				pickCharacter={pickCharacter}
			/>
		);

	if (pointUsed) return <DisabledPickButton point={point} />;

	if (characterPick)
		return (
			<UpdatePickButton
				pick={characterPick}
				point={point}
				pickCharacter={pickCharacter}
			/>
		);

	return (
		<AddPickButton
			character={currentCharacter}
			point={point}
			pickCharacter={pickCharacter}
		/>
	);
};

interface AddPickButtonProps {
	character: Character;
	point: typeof pointArr[number];
	pickCharacter: (character: Character | null) => void;
}

const AddPickButton = ({
	character,
	point,
	pickCharacter,
}: AddPickButtonProps): JSX.Element => (
	<AddPickMutation
		update={(cache, { data }) => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData && data) {
				const { currentUser, characters, myPicks } = cachedData;
				const { addPick } = data;
				const newPicks = [...(myPicks || []), addPick];

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: { characters, currentUser, myPicks: newPicks },
				});
			}
		}}
		variables={{ characterID: character.id, points: point }}>
		{(mutate, { error, loading }) => {
			const addPick = (): void => {
				mutate()
					.then(() => {
						pickCharacter(null);
					})
					.catch(err => displayError(err));
			};

			if (error) displayError(error.message);

			return (
				<Control>
					<Button isColor="primary" isLoading={loading} onClick={addPick}>
						{point}
					</Button>
				</Control>
			);
		}}
	</AddPickMutation>
);

interface DeletePickButtonProps {
	pick: Pick;
	point: typeof pointArr[number];
	pickCharacter: (character: Character | null) => void;
}

const DeletePickButton = ({
	pick,
	point,
	pickCharacter,
}: DeletePickButtonProps): JSX.Element => (
	<DeletePickMutation
		update={(cache, { data }) => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData && data) {
				const { currentUser, characters, myPicks } = cachedData;
				const newPicks = (myPicks || []).filter(myPick => myPick.id != pick.id);

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: { characters, currentUser, myPicks: newPicks },
				});
			}
		}}
		variables={{ pickID: pick.id }}>
		{(mutate, { error, loading }) => {
			const deletePick = (): void => {
				mutate()
					.then(() => {
						pickCharacter(null);
					})
					.catch(err => displayError(err));
			};

			if (error) displayError(error.message);

			return (
				<Control>
					<Button
						isActive
						isLoading={loading}
						isColor="danger"
						onClick={deletePick}>
						{point}
						<span className="is-small is-success">
							&nbsp; <FontAwesomeIcon icon="check" />
						</span>
					</Button>
				</Control>
			);
		}}
	</DeletePickMutation>
);

interface DisabledPickButtonProps {
	point: typeof pointArr[number];
}

const DisabledPickButton = ({
	point,
}: DisabledPickButtonProps): JSX.Element => (
	<Control>
		<Button disabled isColor="primary" type="button">
			{point}
		</Button>
	</Control>
);

interface UpdatePickButtonProps {
	pick: Pick;
	point: typeof pointArr[number];
	pickCharacter: (character: Character | null) => void;
}

const UpdatePickButton = ({
	pick,
	point,
	pickCharacter,
}: UpdatePickButtonProps): JSX.Element => (
	<UpdatePickMutation
		update={(cache, { data }) => {
			const cachedData = cache.readQuery<MakePicksData>({
				query: makePicks,
			});

			if (cachedData && data) {
				const { currentUser, characters, myPicks } = cachedData;
				const { updatePick } = data;
				const newPicks = (myPicks || []).map(myPick => {
					if (myPick.id == pick.id) return updatePick;

					return myPick;
				});

				cache.writeQuery<MakePicksData>({
					query: makePicks,
					data: { characters, currentUser, myPicks: newPicks },
				});
			}
		}}
		variables={{
			characterID: pick.character.id,
			pickID: pick.id,
			points: point,
		}}>
		{(mutate, { error, loading }) => {
			const updatePick = (): void => {
				mutate()
					.then(() => {
						pickCharacter(null);
					})
					.catch(err => displayError(err));
			};

			if (error) displayError(error.message);

			return (
				<Control>
					<Button isColor="primary" isLoading={loading} onClick={updatePick}>
						{point}
					</Button>
				</Control>
			);
		}}
	</UpdatePickMutation>
);

export default PickButton;
