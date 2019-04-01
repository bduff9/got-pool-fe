import { Title } from 'bloomer';
import Link from 'next/link';
import React from 'react';

import Loading from './loading';

import { DUE_DATE_FORMATTED } from '../api/constants';
import { CurrentUserQuery } from '../api/queries';
import { displayError } from '../api/utilities';
import ViewAllPicks from './view-all-picks';

const Dashboard = (): JSX.Element => (
	<CurrentUserQuery>
		{({ data, error, loading }) => {
			if (loading) return <Loading isLoading />;

			if (error || !data) {
				error && displayError(error.message);

				return (
					<Title>
						There was a problem loading data, please try again later
					</Title>
				);
			}

			const { currentUser } = data;
			const { submitted } = currentUser || { submitted: 'N' };

			if (submitted !== 'Y')
				return (
					<Title isSize={4}>
						Please{' '}
						<Link href="/picks/make">
							<a>click here</a>
						</Link>{' '}
						to make your picks before {DUE_DATE_FORMATTED}
					</Title>
				);

			return <ViewAllPicks />;
		}}
	</CurrentUserQuery>
);

export default Dashboard;
