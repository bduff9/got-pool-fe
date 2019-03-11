import React from 'react';
import App, { Container } from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faQuestionCircle, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

import '../styles.scss';

import withApollo from '../components/with-apollo';

library.add(faHome, faQuestionCircle, faSignOutAlt, faUsers);

class MyApp extends App {
  render () {
    const { apolloClient, Component, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApollo(MyApp);
