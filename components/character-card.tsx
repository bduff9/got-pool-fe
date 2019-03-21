import {
	Card,
	CardContent,
	CardImage,
	Image,
	Media,
	MediaContent,
	MediaLeft,
	Tag,
	Title,
} from 'bloomer';
import React from 'react';

import { S3_URL } from '../api/constants';
import { Character, Pick } from '../api/models';

interface CharacterCardProps {
	character: Character;
	pickCharacter: (character: Character) => void;
	picks: Pick[];
}

const CharacterCard = ({
	character,
	pickCharacter,
	picks,
}: CharacterCardProps): JSX.Element => {
	const pickThisCharacter = (): void => pickCharacter(character);
	const used = picks.filter(pick => pick.id === character.id);
	const isUsed = used.length === 1;

	return (
		<Card
			className={character.alive === 'N' ? 'dead' : undefined}
			onClick={pickThisCharacter}
			style={{ cursor: 'pointer' }}>
			<CardImage>
				<Image
					isRatio="square"
					src={`${S3_URL}/images/characters/${character.img}`}
				/>
			</CardImage>
			<CardContent isPaddingless>
				<Media>
					{isUsed && (
						<MediaLeft>
							<Tag isColor="danger">{used[0].points}</Tag>
						</MediaLeft>
					)}
					<MediaContent>
						<Title hasTextAlign="centered" isSize={4}>
							{character.name}
						</Title>
					</MediaContent>
				</Media>
			</CardContent>
		</Card>
	);
};

export default CharacterCard;
