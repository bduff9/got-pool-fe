import React, { Component } from 'react';

import { Context, User } from '../../api/models';
import { displayError, ensureAuthenticated } from '../../api/utilities';
import Loading from '../../components/loading';
import { Authenticated } from '../../layouts/authenticated';
import Default from '../../layouts/default';
import { AdminUsersQuery } from '../../api/queries';
import UsersTable from '../../components/users-table';
import MarkAllSubmittedButton from '../../components/mark-all-submitted-button';

const meta = { title: 'Admin Users' };

class AdminUsers extends Component<{}, {}> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: Context): Promise<{}> {
		ensureAuthenticated(req, res);

		return query;
	}

	public render (): JSX.Element {
		return (
			<Authenticated>
				<Default meta={meta}>
					<MarkAllSubmittedButton />
					<br />
					<br />
					<AdminUsersQuery>
						{({ data, error, loading }) => {
							let users: User[] = [];

							if (loading) return <Loading isLoading />;

							if (error) {
								displayError(error.message);

								return <div>Something went wrong, please try again later</div>;
							}

							if (data && data.adminUsers) {
								users = data.adminUsers;
							}

							return <UsersTable users={users} />;
						}}
					</AdminUsersQuery>
				</Default>
			</Authenticated>
		);
	}
}

export default AdminUsers;
