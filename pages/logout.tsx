import { Icon, Notification } from 'bloomer';
import Link from 'next/link';
import React, { Component } from 'react';
import { FetchResult } from 'react-apollo';

import { writeLogoutLogWrapper } from '../api/mutations';
import { AuthConsumer } from '../components/auth';
import Default from '../layouts/default';

const meta = { title: 'Goodbye' };

class Logout extends Component<{
	writeLogoutLog: (
		userID: string
	) => Promise<void | FetchResult<
	{},
	Record<string, any>,
	Record<string, any>
	>>;
	}> {
	public static async getInitialProps (): Promise<{}> {
		return {};
	}

	public render (): JSX.Element {
		const { writeLogoutLog } = this.props;

		return (
			<Default meta={meta}>
				<AuthConsumer>
					{({ logout, user }) => {
						if (user) {
							const { attributes = {} } = user;
							const { sub: userID } = attributes;

							logout().then(() => writeLogoutLog(userID));

							return (
								<div>
									<Icon isSize="medium" isAlign="left">
										<i className="fa fa-spin fa-spinner" aria-hidden="true" />
									</Icon>
									Logging you out...
								</div>
							);
						}

						return (
							<div>
								<Notification isColor="success">
									You are now logged out!{' '}
									<Link href="/login">
										<a>Click here to sign back in.</a>
									</Link>
								</Notification>
							</div>
						);
					}}
				</AuthConsumer>
			</Default>
		);
	}
}

export default writeLogoutLogWrapper(Logout);
