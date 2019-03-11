import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from 'apollo-boost'
import fetch from 'isomorphic-unfetch';

import { API_URL } from './constants';

let apolloClient: ApolloClient<NormalizedCacheObject>;

if (!process.browser) global.fetch = fetch;

function create (initialState?: any) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link: new HttpLink({
      uri: API_URL,
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo (initialState?: any) {
  if (!process.browser) return create(initialState);

  if (!apolloClient) apolloClient = create(initialState);

  return apolloClient;
}
