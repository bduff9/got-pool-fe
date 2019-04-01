import { Table } from 'bloomer';
import React from 'react';

import { User } from '../api/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface UsersTableProps {
	users: User[];
}

const UsersTable = ({ users }: UsersTableProps): JSX.Element => {
	return (
		<Table>
			<thead>
				<tr>
					<th>User</th>
					<th>Paid</th>
					<th>Submitted</th>
				</tr>
			</thead>
			<tbody>
				{users.map(user => (
					<tr key={`user-${user.id}`}>
						<td>
							{user.name}
							{user.submitted !== 'Y' && (
								<span
									className="clickable is-danger"
									onClick={() => console.log('TODO: delete user')}
								>
									<FontAwesomeIcon icon="times" />
								</span>
							)}
						</td>
						<td
							className={`clickable is-${
								user.paid === 'Y' ? 'success' : 'danger'
							}`}
							onClick={() => console.log('TODO: toggle paid')}
						>
							<FontAwesomeIcon icon="money-bill" />
						</td>
						<td
							className={`clickable is-${
								user.submitted === 'Y' ? 'success' : 'danger'
							}`}
							onClick={() => console.log('TODO: toggle submitted')}
						>
							<FontAwesomeIcon icon="users" />
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default UsersTable;
