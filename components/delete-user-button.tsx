import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { DeleteUserMutation } from '../api/mutations';
import { AdminUsersData, adminUsers } from '../api/queries';
import { displayError } from '../api/utilities';

interface DeleteUserButtonProps {
	userID: string;
}

const DeleteUserButton = ({ userID }: DeleteUserButtonProps): JSX.Element => {
	return (
		<DeleteUserMutation
			update={cache => {
				const cachedData = cache.readQuery<AdminUsersData>({
					query: adminUsers,
				});

				if (cachedData) {
					const { adminUsers: adminUsersOld } = cachedData;
					const newAdminUsers = adminUsersOld.filter(({ id }) => id !== userID);

					cache.writeQuery<AdminUsersData>({
						query: adminUsers,
						data: { adminUsers: newAdminUsers },
					});
				}
			}}
			variables={{ userID }}
		>
			{(mutation, { error, loading }) => {
				const _deleteUser = (): void => {
					if (confirm('Are you sure you want to delete this user?'))
						mutation().catch(displayError);
				};

				if (loading) return <FontAwesomeIcon icon="spinner" pulse />;

				if (error) displayError(error.message);

				return (
					<span className="clickable has-text-danger" onClick={_deleteUser}>
						<FontAwesomeIcon icon="times-circle" fixedWidth />
					</span>
				);
			}}
		</DeleteUserMutation>
	);
};

export default DeleteUserButton;
