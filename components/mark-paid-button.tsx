import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { adopt } from 'react-adopt';
import { MutationFn, MutationResult } from 'react-apollo';

import { paymentTypes, RenderProp } from '../api/models';
import {
	UpdateUserMutation,
	UpdateUserData,
	UpdateUserVars,
	WritePaidLogData,
	WritePaidLogVars,
	WritePaidLogMutation,
} from '../api/mutations';
import { AdminUsersData, adminUsers } from '../api/queries';
import { displayError } from '../api/utilities';

interface MarkPaidButtonProps {
	hasPaid: boolean;
	paymentType: typeof paymentTypes[number];
	userID: string;
}

interface MarkPaidButtonRenderProps {
	updateUser: {
		mutation: MutationFn<UpdateUserData, UpdateUserVars>;
		result: MutationResult<UpdateUserData>;
	};
	writePaidLog: {
		mutation: MutationFn<WritePaidLogData, WritePaidLogVars>;
		result: MutationResult<WritePaidLogData>;
	};
}

const updateUser = ({ render }: RenderProp): JSX.Element => (
	<UpdateUserMutation
		update={(cache, { data }) => {
			const cachedData = cache.readQuery<AdminUsersData>({
				query: adminUsers,
			});

			if (cachedData && data) {
				const { adminUsers: adminUsersOld } = cachedData;
				const {
					updateUser: { id, paid },
				} = data;
				const newAdminUsers = adminUsersOld.map(user => {
					if (user.id === id) return { ...user, paid };

					return user;
				});

				cache.writeQuery<AdminUsersData>({
					query: adminUsers,
					data: { adminUsers: newAdminUsers },
				});
			}
		}}
	>
		{(mutation, result) => render && render({ mutation, result })}
	</UpdateUserMutation>
);

const writePaidLog = ({ render }: RenderProp): JSX.Element => (
	<WritePaidLogMutation>
		{(mutation, result) => render && render({ mutation, result })}
	</WritePaidLogMutation>
);

const Composed = adopt<MarkPaidButtonRenderProps, {}>({
	updateUser,
	writePaidLog,
});

const MarkPaidButton = ({
	hasPaid,
	paymentType,
	userID,
}: MarkPaidButtonProps): JSX.Element => (
	<Composed>
		{({ updateUser, writePaidLog }) => {
			const _markPaid = (): void => {
				updateUser
					.mutation({ variables: { isPaid: hasPaid ? 'N' : 'Y', userID } })
					.then(() =>
						writePaidLog.mutation({
							variables: { action: 'PAID', message: '', userID },
						}),
					);
			};

			const {
				error: updateUserError,
				loading: updateUserLoading,
			} = updateUser.result;
			const {
				error: writeLogError,
				loading: writeLogLoading,
			} = writePaidLog.result;

			if (updateUserLoading || writeLogLoading)
				return <FontAwesomeIcon icon="spinner" pulse />;

			if (updateUserError) displayError(updateUserError.message);

			if (writeLogError) displayError(writeLogError.message);

			return (
				<span
					className={`clickable has-text-${hasPaid ? 'success' : 'danger'}`}
					onClick={_markPaid}
				>
					{paymentType === 'CASH' ? (
						<FontAwesomeIcon icon="money-bill" />
					) : paymentType === 'PAYPAL' ? (
						<FontAwesomeIcon icon={['fab', 'paypal']} />
					) : paymentType === 'VENMO' ? (
						<FontAwesomeIcon icon="mobile-alt" />
					) : paymentType === 'ZELLE' ? (
						<FontAwesomeIcon icon="piggy-bank" />
					) : (
						'ERROR'
					)}
				</span>
			);
		}}
	</Composed>
);

export default MarkPaidButton;
