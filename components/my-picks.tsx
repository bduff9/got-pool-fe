import { Box, Column, Columns } from 'bloomer';
import React from 'react';

import { pointArr, Pick } from '../api/models';

interface MyPickProps {
	myPicks: Pick[];
}

const MyPicks = ({ myPicks }: MyPickProps): JSX.Element => {
	const pickPlaceholders = pointArr.map(points => ({ points }));

	return (
		<Columns>
			{pickPlaceholders.map(pick => {
				const myPick = myPicks.filter(
					myPick => myPick.points === pick.points
				)[0];

				return (
					<Column key={`my-pick-${pick.points}`}>
						<Box>{myPick || pick.points}</Box>
					</Column>
				);
			})}
		</Columns>
	);
};

export default MyPicks;
