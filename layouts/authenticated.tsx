import Router from 'next/router';
import React from 'react';

import { AuthConsumer } from '../components/auth';

interface AuthenticatedProps {
	children: JSX.Element[] | JSX.Element;
}

export const Authenticated = ({
	children,
}: AuthenticatedProps): JSX.Element => (
	<AuthConsumer>
		{({ isSignedIn, loading }) => {
			if (loading) return <div>Loading...</div>;

			if (!isSignedIn) Router.push('/login');

			return children;
		}}
	</AuthConsumer>
);
