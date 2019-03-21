import { Column, Columns } from 'bloomer';
import React from 'react';
import CharacterCard from './character-card';
import { Character, Pick } from '../api/models';

interface CharacterPickGridProps {
	characters: Character[];
	myPicks: Pick[];
	pickCharacter: (character: Character) => void;
}

const CharacterPickGrid = ({
	characters,
	myPicks,
	pickCharacter,
}: CharacterPickGridProps): JSX.Element => {
	return (
		<Columns isMultiline>
			{characters.map((character: Character) => (
				<Column
					isSize={{
						default: '1/4',
						tablet: '1/2',
						mobile: 'full',
					}}
					key={`character-${character.id}`}>
					<CharacterCard
						character={character}
						picks={myPicks}
						pickCharacter={pickCharacter}
					/>
				</Column>
			))}
		</Columns>
	);
};

export default CharacterPickGrid;
