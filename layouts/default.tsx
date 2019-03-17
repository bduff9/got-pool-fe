import React, { Fragment, ReactNode } from 'react';
import { Section } from 'bloomer';

import Meta from '../components/meta';
import Navigation from '../components/navigation';
import { AuthConsumer } from '../components/auth';
import { Query } from 'react-apollo';
import { currentUser } from '../api/queries';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';

interface MetaObj {
	description?: string;
	title?: string;
}

const DefaultLayout = ({
	children,
	meta,
}: {
children: ReactNode;
meta: MetaObj;
}): JSX.Element => (
	<div>
		<AuthConsumer>
			{({ isSignedIn, user }) => (
				<Query query={currentUser}>
					{({ data }) => {
						let hasSubmitted = false;
						let isAdmin = false;

						if (data) {
							const { currentUser } = data;

							hasSubmitted = currentUser && currentUser.submitted === 'Y';
						}

						if (user) {
							const session = user.getSignInUserSession();
							const groups =
								session &&
								session.getAccessToken().decodePayload()['cognito:groups'];

							isAdmin = groups && groups.indexOf('ADMIN') > -1;
						}

						return (
							<Fragment>
								<Meta {...meta} />
								<Navigation
									authenticated={isSignedIn}
									hasSubmitted={hasSubmitted}
									isAdmin={isAdmin}
								/>
								<Section hasTextAlign="centered">{children}</Section>
							</Fragment>
						);
					}}
				</Query>
			)}
		</AuthConsumer>
	</div>
);

export default DefaultLayout;
