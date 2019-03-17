import { Container } from 'bloomer';
import React, { Component } from 'react';
import { FetchResult } from 'react-apollo';

import { writeRegisterLogWrapper } from '../api/mutations';
import RegistrationForm from '../components/registration-form';
import Default from '../layouts/default';

const meta = { title: 'Register' };

class Register extends Component<{
	email: string;
	password: string;
	writeRegisterLog: (
		userID: string
	) => Promise<void | FetchResult<
	{},
	Record<string, any>,
	Record<string, any>
	>>;
}> {
	public static async getInitialProps ({
		query,
	}: {
		query: { email: string; password: string };
	}): Promise<{}> {
		return query;
	}

	public render (): JSX.Element {
		const {
			email,
			password,
			writeRegisterLog,
		}: {
			email: string;
			password: string;
			writeRegisterLog: (
				userID: string
			) => Promise<void | FetchResult<
		{},
		Record<string, any>,
		Record<string, any>
		>>;
		} = this.props;

		return (
			<Default meta={meta}>
				<Container>
					<RegistrationForm
						email={email}
						password={password}
						writeRegisterLog={writeRegisterLog}
					/>
				</Container>
			</Default>
		);
	}
}

export default writeRegisterLogWrapper(Register);
