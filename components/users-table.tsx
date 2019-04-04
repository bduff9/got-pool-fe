import { Table } from 'bloomer';
import React from 'react';

import { User } from '../api/models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MarkPaidButton from './mark-paid-button';
import MarkSubmittedButton from './mark-submitted-button';
import DeleteUserButton from './delete-user-button';

interface UsersTableProps {
	users: User[];
}

const UsersTable = ({ users }: UsersTableProps): JSX.Element => {
	return (
		<Table>
			<thead>
				<tr>
					<th />
					<th>User</th>
					<th>Paid</th>
					<th>Account</th>
					<th>Submitted</th>
				</tr>
			</thead>
			<tbody>
				{users.map(user => (
					<tr key={`user-${user.id}`}>
						<td>
							{user.submitted !== 'Y' && <DeleteUserButton userID={user.id} />}
						</td>
						<td className="nowrap">{user.name}</td>
						<td className="has-text-centered">
							<MarkPaidButton
								hasPaid={user.paid === 'Y'}
								paymentType={user.payment_option}
								userID={user.id}
							/>
						</td>
						<td className="nowrap" title={user.payment_option}>
							{user.payment_account}
						</td>
						<td className="has-text-centered">
							<MarkSubmittedButton
								hasSubmitted={user.submitted === 'Y'}
								userID={user.id}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
};

export default UsersTable;
