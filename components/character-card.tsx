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
	isMini?: boolean;
	pickCharacter?: (character: Character) => void;
	picks?: Pick[];
}

const CharacterCard = ({
	character,
	isMini = false,
	pickCharacter = () => {},
	picks = [],
}: CharacterCardProps): JSX.Element => {
	const pickThisCharacter = (): void => pickCharacter(character);
	const used = picks.filter(pick => pick.character.id === character.id);
	const isUsed = used.length > 0;

	return (
		<Card
			className={character.alive === 'N' ? 'dead' : undefined}
			onClick={pickThisCharacter}
			style={{ cursor: isMini ? 'auto' : 'pointer' }}
			title={character.name}
		>
			{isMini && isUsed && (
				<Tag isColor="danger" className="is-rounded mini-card-tag">
					{used[0].points}
				</Tag>
			)}
			<CardImage>
				<Image
					className={isMini ? 'mini' : 'full'}
					isRatio="square"
					src={`${S3_URL}/images/characters/${character.img}`}
				/>
			</CardImage>
			{!isMini && (
				<CardContent isPaddingless>
					<Media>
						{isUsed && (
							<MediaLeft isMarginless>
								<Tag isColor="danger">{used[0].points}</Tag>
							</MediaLeft>
						)}
						<MediaContent>
							{isMini ? (
								character.name
							) : (
								<Title hasTextAlign="centered" isSize={4}>
									{character.name}
								</Title>
							)}
						</MediaContent>
					</Media>
				</CardContent>
			)}
		</Card>
	);
};

export default CharacterCard;
