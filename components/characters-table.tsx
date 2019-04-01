import { Button, Table } from 'bloomer';
import React from 'react';

import { Character } from '../api/models';
import { ToggleCharacterAliveMutation } from '../api/mutations';
import { AllCharactersData, allCharacters } from '../api/queries';
import { displayError } from '../api/utilities';

interface CharactersTableProps {
	characters: Character[];
}

const CharactersTable = ({ characters }: CharactersTableProps): JSX.Element => {
	return (
		<Table>
			<thead>
				<tr>
					<th>Character</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{characters.map(character => (
					<tr key={`character-${character.id}`}>
						<td className={character.alive === 'Y' ? '' : 'dead'}>
							{character.name}
						</td>
						<td>
							<ToggleCharacterAliveMutation
								update={(cache, { data }) => {
									const cachedData = cache.readQuery<AllCharactersData>({
										query: allCharacters,
									});

									if (cachedData && data) {
										const { characters } = cachedData;
										const currentCharacter = data.toggleCharacterAlive;
										const updatedCharacters = characters.map(character => {
											if (character.id === currentCharacter.id) {
												return currentCharacter;
											}

											return character;
										});

										cache.writeQuery<AllCharactersData>({
											query: allCharacters,
											data: { characters: updatedCharacters },
										});
									}
								}}
								variables={{
									characterID: character.id,
									markAlive: character.alive === 'Y' ? 'N' : 'Y',
								}}
							>
								{(mutate, { error, loading }) => {
									const toggleStatus = (): void => {
										mutate().catch(err => displayError(err));
									};

									if (error) displayError(error.message);

									return (
										<Button
											isColor={character.alive === 'Y' ? 'danger' : 'success'}
											isLoading={loading}
											onClick={toggleStatus}
										>
											{character.alive === 'Y' ? 'Mark Dead' : 'Mark Alive'}
										</Button>
									);
								}}
							</ToggleCharacterAliveMutation>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default CharactersTable;
