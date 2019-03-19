import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import fetch from 'isomorphic-unfetch';
import Cookies from 'universal-cookie';

import { API_URL } from './constants';
import { COOKIE_NAME } from '../components/auth';

const cookies = new Cookies();
let apolloClient: ApolloClient<NormalizedCacheObject>;

if (!process.browser) global.fetch = fetch;

const authLink = setContext((_, { headers }) => {
	const token = cookies.get(COOKIE_NAME);

	return {
		headers: {
			...headers,
			authorization: token || '',
		},
	};
});

const httpLink = createHttpLink({
	uri: API_URL,
});

const retryLink = new RetryLink({ attempts: { max: Infinity } });

function create (initialState?: any): ApolloClient<NormalizedCacheObject> {
	const cache = new InMemoryCache().restore(initialState || {});
	const link = retryLink.concat(authLink).concat(httpLink);

	if (typeof window !== 'undefined') {
		persistCache({
			cache,
			storage: window.localStorage,
		});
	}

	return new ApolloClient({
		cache,
		connectToDevTools: process.browser,
		link,
		ssrMode: !process.browser,
	});
}

export default function initApollo (
	initialState?: any
): ApolloClient<NormalizedCacheObject> {
	if (!process.browser) return create(initialState);

	if (!apolloClient) apolloClient = create(initialState);

	return apolloClient;
}
