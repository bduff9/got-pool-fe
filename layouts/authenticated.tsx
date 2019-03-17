import Router from 'next/router';
import React from 'react';

import { AuthConsumer } from '../components/auth';

export const Authenticated = ({
	children,
}: {
children: JSX.Element[] | JSX.Element;
}): JSX.Element => (
	<AuthConsumer>
		{({ isSignedIn, loading }) => {
			if (loading) return <div>Loading...</div>;

			if (!isSignedIn) Router.push('/login');

			return children;
		}}
	</AuthConsumer>
);
