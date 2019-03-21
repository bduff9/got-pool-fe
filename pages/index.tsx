import { Title } from 'bloomer';
import { Request, Response } from 'express';
import Link from 'next/link';
import React, { Component } from 'react';

import { DUE_DATE_FORMATTED } from '../api/constants';
import { ensureAuthenticated } from '../api/utilities';
import { Authenticated } from '../layouts/authenticated';
import Default from '../layouts/default';

const meta = { title: 'Dashboard' };

class IndexPage extends Component {
	public static async getInitialProps ({
		req,
		res,
	}: {
		req: Request;
		res: Response;
	}): Promise<{}> {
		ensureAuthenticated(req, res);

		return {};
	}

	public render (): JSX.Element {
		return (
			<Authenticated>
				<Default meta={meta}>
					<Title isSize="medium">
						Please{' '}
						<Link href="/picks/make">
							<a>click here</a>
						</Link>{' '}
						to make your picks before {DUE_DATE_FORMATTED}
					</Title>
				</Default>
			</Authenticated>
		);
	}
}

export default IndexPage;
