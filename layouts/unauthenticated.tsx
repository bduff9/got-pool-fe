import Router from 'next/router';
import React from 'react';

import { AuthConsumer } from '../components/auth';

interface UnauthenticatedProps {
	children: JSX.Element[] | JSX.Element;
}

export const Unauthenticated = ({
	children,
}: UnauthenticatedProps): JSX.Element => (
	<AuthConsumer>
		{({ isSignedIn, loading }) => {
			if (loading) return <div>Loading...</div>;

			if (isSignedIn) Router.push('/');

			return children;
		}}
	</AuthConsumer>
);
