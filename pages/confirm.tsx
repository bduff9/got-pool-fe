import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import ConfirmForm from '../components/confirm-form';

const meta = { title: 'Confirm Email' };

class Confirm extends Component<
	{
	email: string;
	},
	{}
	> {
	public static async getInitialProps ({
		query,
	}: {
	query: { email: string };
	}): Promise<{}> {
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
