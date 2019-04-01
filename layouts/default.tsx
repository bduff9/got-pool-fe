import React, { Fragment, ReactNode } from 'react';
import { Section } from 'bloomer';

import { CurrentUserQuery } from '../api/queries';
import Meta from '../components/meta';
import Navigation from '../components/navigation';
import { AuthConsumer } from '../components/auth';

interface MetaObj {
	description?: string;
	title?: string;
}

interface DefaultLayoutProps {
	children: ReactNode;
	meta: MetaObj;
}

const DefaultLayout = ({ children, meta }: DefaultLayoutProps): JSX.Element => (
	<div>
		<AuthConsumer>
			{({ isSignedIn, user }) => (
				<CurrentUserQuery>
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
				</CurrentUserQuery>
			)}
		</AuthConsumer>
	</div>
);

export default DefaultLayout;
