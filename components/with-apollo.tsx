import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import Head from 'next/head';
import React, { Component } from 'react';
import { getDataFromTree } from 'react-apollo';

import initApollo from '../api/apollo';
import { Context } from '../api/models';

const withApollo = (App: Component): Component =>
	class Apollo extends Component {
		public static displayName = 'withApollo(App)';
		private apolloClient: ApolloClient<NormalizedCacheObject>;

		public static async getInitialProps (ctx: Context): Promise<{}> {
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

		public constructor (props: any) {
			super(props);

			this.apolloClient = initApollo(props.apolloState);
		}

		public render (): JSX.Element {
			return <App {...this.props} apolloClient={this.apolloClient} />;
		}
	};

export default withApollo;
