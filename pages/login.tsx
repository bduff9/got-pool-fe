import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import LoginForm from '../components/login-form';
import { ensureUnauthenticated } from '../api/utilities';
import { Unauthenticated } from '../layouts/unauthenticated';
import { Context } from '../api/models';

const meta = { title: 'Login' };

interface LoginProps {
	email: string;
	password: string;
}

class Login extends Component<LoginProps> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: Context): Promise<{}> {
		ensureUnauthenticated(req, res);

		return query;
	}

	public render (): JSX.Element {
		const { email, password } = this.props;

		return (
			<Unauthenticated>
				<Default meta={meta}>
					<Container>
						<LoginForm email={email} password={password} />
					</Container>
				</Default>
			</Unauthenticated>
		);
	}
}

export default Login;
