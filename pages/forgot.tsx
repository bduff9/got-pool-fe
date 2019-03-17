import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import ForgotPasswordForm from '../components/forgot-password-form';
import { Request, Response } from 'express';
import { ensureUnauthenticated } from '../api/utilities';
import { Unauthenticated } from '../layouts/unauthenticated';

const meta = { title: 'Forgot Password' };

class ForgotPassword extends Component<{ email: string; password: string }> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: {
	req: Request;
	res: Response;
	query: { email: string };
	}): Promise<{}> {
		ensureUnauthenticated(req, res);

		return query;
	}

	public render (): JSX.Element {
		const { email } = this.props;

		return (
			<Unauthenticated>
				<Default meta={meta}>
					<Container>
						<ForgotPasswordForm email={email} />
					</Container>
				</Default>
			</Unauthenticated>
		);
	}
}

export default ForgotPassword;
