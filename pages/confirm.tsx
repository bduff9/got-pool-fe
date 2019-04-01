import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import ConfirmForm from '../components/confirm-form';
import { Context } from '../api/models';

const meta = { title: 'Confirm Email' };

interface ConfirmProps {
	email: string;
}
class Confirm extends Component<ConfirmProps> {
	public static async getInitialProps ({ query }: Context): Promise<{}> {
		return query;
	}

	public render (): JSX.Element {
		const { email } = this.props;

		return (
			<Default meta={meta}>
				<Container>
					<ConfirmForm email={email} />
				</Container>
			</Default>
		);
	}
}

export default Confirm;
