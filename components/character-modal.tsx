import {
	Card,
	CardContent,
	CardHeader,
	CardHeaderTitle,
	Field,
	Modal,
	ModalBackground,
	ModalClose,
	ModalContent,
	Title,
} from 'bloomer';
import React, { MouseEvent } from 'react';

import { pointArr, Character, Pick } from '../api/models';
import PickButton from './pick-button';

interface CharacterModalProps {
	character: Character;
	closeModal: (ev: MouseEvent<HTMLElement>) => void;
	picks: Pick[];
	pickCharacter: (character: Character | null) => void;
}

const CharacterModal = ({
	character,
	picks,
	closeModal,
	pickCharacter,
}: CharacterModalProps): JSX.Element => {
	const characterPick: Pick | null = picks.filter(
		pick => character && pick.character.id === character.id
	)[0];
	const usedPoints = picks.map(({ points }) => points);

	return (
		<Modal isActive>
			<ModalBackground onClick={closeModal} />
			<ModalContent>
				<Card>
					<CardHeader>
						<CardHeaderTitle hasTextAlign="centered">
							{character.name}
						</CardHeaderTitle>
					</CardHeader>
					<CardContent>
						{character.alive === 'Y' ? (
							<Field hasAddons="centered">
								{pointArr.map(point => (
									<PickButton
										characterPick={characterPick}
										currentCharacter={character}
										point={point}
										usedPoints={usedPoints}
										pickCharacter={pickCharacter}
										key={`pick-button-${point}`}
									/>
								))}
							</Field>
						) : (
							<Title size={3}>Dead</Title>
						)}
					</CardContent>
				</Card>
			</ModalContent>
			<ModalClose onClick={closeModal} />
		</Modal>
	);
};

export default CharacterModal;
