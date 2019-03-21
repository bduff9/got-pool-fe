import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardHeaderTitle,
	Control,
	Field,
	Modal,
	ModalBackground,
	ModalClose,
	ModalContent,
	Title,
} from 'bloomer';
import React, { MouseEvent } from 'react';

import { pointArr, Character, Pick } from '../api/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface CharacterModalProps {
	character: Character;
	closeModal: (ev: MouseEvent<HTMLElement>) => void;
	picks: Pick[];
	setPoints: (
		characterID: number,
		points: number,
		actionMode: 'delete' | 'update' | 'add'
	) => void;
}

const CharacterModal = ({
	character,
	picks,
	closeModal,
	setPoints,
}: CharacterModalProps): JSX.Element => {
	const _getPointUsed = (point: typeof pointArr[number]): Pick =>
		picks.filter(pick => pick.points === point)[0];

	const _getCharacterUsed = (): Pick =>
		picks.filter(pick => character && pick.character.id === character.id)[0];

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
								{pointArr.map(num => {
									const pointUsed = _getPointUsed(num);
									const characterUsed = _getCharacterUsed();
									const bothUsed =
										pointUsed &&
										characterUsed &&
										pointUsed.id === characterUsed.id;
									const actionMode = bothUsed
										? 'delete'
										: characterUsed
											? 'update'
											: 'add';

									return (
										<Control key={`button${num}`}>
											<Button
												disabled={!!pointUsed && !bothUsed}
												isActive={!!bothUsed}
												isColor="primary"
												onClick={() =>
													setPoints(character.id, num, actionMode)
												}>
												{num}
												{bothUsed ? (
													<span className="is-small is-success">
														&nbsp; <FontAwesomeIcon icon="check" />
													</span>
												) : null}
											</Button>
										</Control>
									);
								})}
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
