import React, { Component } from 'react';
import Head from 'next/head';
import { getDataFromTree } from 'react-apollo';

import initApollo from '../api/apollo';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

const withApollo = App => class Apollo extends Component {
	static displayName = 'withApollo(App)';
	apolloClient: ApolloClient<NormalizedCacheObject>;

	static async getInitialProps (ctx: any) {
		const { Component, router } = ctx;
		let appProps = {};

		if (App.getInitialProps) appProps = await App.getInitialProps(ctx);

		const apollo = initApollo();

		if (!process.browser) {
			try {
				await getDataFromTree(
					<App
						{...appProps}
						Component={Component}
						router={router}
						apolloClient={apollo}
					/>
				);
			} catch (error) {
				console.error('Error while running `getDataFromTree`', error);
			}

			Head.rewind();
		}

		const apolloState = apollo.cache.extract();

		return {
			...appProps,
			apolloState,
		};
	}

	constructor (props: any) {
		super(props);

		this.apolloClient = initApollo(props.apolloState);
	}

	render () {
		return <App {...this.props} apolloClient={this.apolloClient} />;
	}
}

export default withApollo;
