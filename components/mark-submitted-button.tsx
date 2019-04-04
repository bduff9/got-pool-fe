import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { UpdateUserMutation } from '../api/mutations';
import { AdminUsersData, adminUsers } from '../api/queries';
import { displayError } from '../api/utilities';

interface MarkSubmittedButtonProps {
	hasSubmitted: boolean;
	userID: string;
}

const MarkSubmittedButton = ({
	hasSubmitted,
	userID,
}: MarkSubmittedButtonProps): JSX.Element => {
	return (
		<UpdateUserMutation
			update={(cache, { data }) => {
				const cachedData = cache.readQuery<AdminUsersData>({
					query: adminUsers,
				});

				if (cachedData && data) {
					const { adminUsers: adminUsersOld } = cachedData;
					const {
						updateUser: { id, submitted },
					} = data;
					const newAdminUsers = adminUsersOld.map(user => {
						if (user.id === id) return { ...user, submitted };

						return user;
					});

					cache.writeQuery<AdminUsersData>({
						query: adminUsers,
						data: { adminUsers: newAdminUsers },
					});
				}
			}}
			variables={{ isSubmitted: hasSubmitted ? 'N' : 'Y', userID }}
		>
			{(mutation, { error, loading }) => {
				const _markSubmitted = (): void => {
					mutation().catch(displayError);
				};

				if (loading) return <FontAwesomeIcon icon="spinner" pulse />;

				if (error) displayError(error.message);

				return (
					<span
						className={`clickable has-text-${
							hasSubmitted ? 'success' : 'danger'
						}`}
						onClick={_markSubmitted}
					>
						<FontAwesomeIcon icon="users" />
					</span>
				);
			}}
		</UpdateUserMutation>
	);
};

export default MarkSubmittedButton;
