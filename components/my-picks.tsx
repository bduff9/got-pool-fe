import { Box, Column, Columns } from 'bloomer';
import React from 'react';

import { pointArr, Pick } from '../api/models';
import CharacterCard from './character-card';

interface MyPickProps {
	myPicks: Pick[];
}

const MyPicks = ({ myPicks }: MyPickProps): JSX.Element => {
	const pickPlaceholders = pointArr.map(points => ({ points })).reverse();

	return (
		<Columns>
			{pickPlaceholders.map(pick => {
				const myPick = myPicks.filter(myPick => myPick.points === pick.points);

				return (
					<Column className="my-pick" key={`my-pick-${pick.points}`}>
						{myPick.length > 0 ? (
							<CharacterCard
								character={myPick[0].character}
								isMini
								picks={myPick}
							/>
						) : (
							<Box>{pick.points}</Box>
						)}
					</Column>
				);
			})}
		</Columns>
	);
};

export default MyPicks;
