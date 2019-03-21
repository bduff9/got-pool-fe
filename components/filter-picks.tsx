import { Column, Columns, Control, Field, Input } from 'bloomer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent } from 'react';

interface FilterPicksProps {
	filterCharacters: (ev: ChangeEvent<HTMLInputElement>) => void;
	filterString: string;
	isMinified: boolean;
	toggleMinification: () => void;
}

const FilterPicks = ({
	filterCharacters,
	filterString,
	isMinified,
	toggleMinification,
}: FilterPicksProps): JSX.Element => {
	return (
		<Columns>
			<Column isSize="3/4">
				<Field isHidden={isMinified}>
					<Control hasIcons="left">
						<Input
							type="text"
							placeholder="Search Character Name"
							onChange={filterCharacters}
							value={filterString}
						/>
						<span className="icon is-small is-left">
							<FontAwesomeIcon icon="search" />
						</span>
					</Control>
				</Field>
			</Column>
			<Column isSize="1/4">
				<span
					className="icon is-large"
					style={{ cursor: 'pointer' }}
					onClick={toggleMinification}>
					<FontAwesomeIcon icon={isMinified ? 'plus-square' : 'minus-square'} />
				</span>
			</Column>
		</Columns>
	);
};

export default FilterPicks;
