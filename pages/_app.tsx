import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faHome,
	faKey,
	faLock,
	faQuestionCircle,
	faSignOutAlt,
	faUser,
	faUsers,
	faBookDead,
	faReceipt,
	faUserCog,
} from '@fortawesome/free-solid-svg-icons';
import App, { Container } from 'next/app';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ToastContainer } from 'react-toastify';

import '../api/amplify';
import '../styles.scss';

import { AuthProvider } from '../components/auth';
import withApollo from '../components/with-apollo';

library.add(
	faBookDead,
	faHome,
	faKey,
	faLock,
	faQuestionCircle,
	faReceipt,
	faSignOutAlt,
	faUser,
	faUsers,
	faUserCog
);

class MyApp extends App {
	public render (): JSX.Element {
		const { apolloClient, Component, pageProps } = this.props;

		return (
			<Container>
				<ToastContainer />
				<AuthProvider>
					<ApolloProvider client={apolloClient}>
						<Component {...pageProps} />
					</ApolloProvider>
				</AuthProvider>
			</Container>
		);
	}
}

export default withApollo(MyApp);
