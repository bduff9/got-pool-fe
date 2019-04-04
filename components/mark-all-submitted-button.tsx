import { Button } from 'bloomer';
import React from 'react';

import { yesNo } from '../api/models';
import { MarkAllUsersSubmittedMutation } from '../api/mutations';
import { AdminUsersData, adminUsers } from '../api/queries';
import { displayError } from '../api/utilities';

const MarkAllSubmittedButton = (): JSX.Element => (
	<MarkAllUsersSubmittedMutation
		update={cache => {
			const cachedData = cache.readQuery<AdminUsersData>({
				query: adminUsers,
			});

			if (cachedData) {
				const { adminUsers: oldAdminUsers } = cachedData;
				const submitted: typeof yesNo[number] = 'Y';
				const newAdminUsers = oldAdminUsers.map(user => ({
					...user,
					submitted,
				}));

				cache.writeQuery<AdminUsersData>({
					query: adminUsers,
					data: { adminUsers: newAdminUsers },
				});
			}
		}}
	>
		{(mutation, { error, loading }) => {
			const _markAllSubmitted = (): void => {
				if (confirm('Are you sure you want to mark all users submitted?'))
					mutation();
			};

			if (error) displayError(error.message);

			return (
				<Button
					isColor="danger"
					isLoading={loading}
					onClick={_markAllSubmitted}
				>
					Mark All Submitted
				</Button>
			);
		}}
	</MarkAllUsersSubmittedMutation>
);

export default MarkAllSubmittedButton;
