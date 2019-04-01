import { Container } from 'bloomer';
import React, { Component } from 'react';

import { Context } from '../api/models';
import { ensureUnauthenticated } from '../api/utilities';
import ForgotPasswordForm from '../components/forgot-password-form';
import Default from '../layouts/default';
import { Unauthenticated } from '../layouts/unauthenticated';

const meta = { title: 'Forgot Password' };

interface ForgotPasswordProps {
	email: string;
	password: string;
}

class ForgotPassword extends Component<ForgotPasswordProps> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: Context): Promise<{}> {
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
