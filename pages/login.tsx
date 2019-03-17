import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import LoginForm from '../components/login-form';
import { Request, Response } from 'express';
import { ensureUnauthenticated } from '../api/utilities';
import { Unauthenticated } from '../layouts/unauthenticated';

const meta = { title: 'Login' };

class Login extends Component<{ email: string; password: string }> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: {
	req: Request;
	res: Response;
	query: { email: string; password: string };
	}): Promise<{}> {
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
