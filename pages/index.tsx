import { Title } from 'bloomer';
import React, { Component } from 'react';

import { ensureAuthenticated } from '../api/utilities';
import Dashboard from '../components/dashboard';
import { Authenticated } from '../layouts/authenticated';
import Default from '../layouts/default';
import { Context } from '../api/models';

const meta = { title: 'Dashboard' };

class IndexPage extends Component {
	public static async getInitialProps ({ req, res }: Context): Promise<{}> {
		ensureAuthenticated(req, res);

		return {};
	}

	public render (): JSX.Element {
		return (
			<Authenticated>
				<Default meta={meta}>
					<Title isSize={1}>Welcome to the Death Pool!</Title>
					<Dashboard />
				</Default>
			</Authenticated>
		);
	}
}

export default IndexPage;
