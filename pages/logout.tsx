import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Notification } from 'bloomer';
import Link from 'next/link';
import React, { Component } from 'react';
import { FetchResult } from 'react-apollo';

import { WriteLogoutLogMutation } from '../api/mutations';
import { AuthConsumer } from '../components/auth';
import Default from '../layouts/default';
import { displayError } from '../api/utilities';

const meta = { title: 'Goodbye' };

class Logout extends Component<{
	writeLogoutLog: (
		userID: string
	) => Promise<void | FetchResult<
		{},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Record<string, any>,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Record<string, any>
	>>;
}> {
	public static async getInitialProps (): Promise<{}> {
		return {};
	}

	public render (): JSX.Element {
		return (
			<Default meta={meta}>
				<AuthConsumer>
					{({ logout, user }) => {
						if (user) {
							const { attributes = {} } = user;
							const { sub: userID } = attributes;

							return (
								<WriteLogoutLogMutation
									variables={{ action: 'LOGOUT', message: '', userID }}>
									{(mutation, { error, loading }) => {
										logout()
											.then(() => mutation())
											.catch(displayError);

										if (error) displayError(error.message);

										if (loading) {
											return (
												<div>
													<span className="is-medium is-left">
														<FontAwesomeIcon icon="spinner" spin />
													</span>
													Logging you out...
												</div>
											);
										}

										return <div>Success!</div>;
									}}
								</WriteLogoutLogMutation>
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

export default Logout;
