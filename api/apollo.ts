import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
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

function create (initialState?: any): ApolloClient<NormalizedCacheObject> {
	return new ApolloClient({
		cache: new InMemoryCache().restore(initialState || {}),
		connectToDevTools: process.browser,
		link: authLink.concat(httpLink),
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
