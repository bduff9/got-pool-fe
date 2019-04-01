import { Container } from 'bloomer';
import React, { Component } from 'react';

import { Context } from '../api/models';
import RegistrationForm from '../components/registration-form';
import Default from '../layouts/default';

const meta = { title: 'Register' };

export interface RegisterProps {
	email: string;
	password: string;
}

class Register extends Component<RegisterProps> {
	public static async getInitialProps ({ query }: Context): Promise<{}> {
		return query;
	}

	public render (): JSX.Element {
		const { email, password } = this.props;

		return (
			<Default meta={meta}>
				<Container>
					<RegistrationForm email={email} password={password} />
				</Container>
			</Default>
		);
	}
}

export default Register;
