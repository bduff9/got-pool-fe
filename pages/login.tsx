import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import LoginForm from '../components/login-form';

const meta = { title: 'Login' };

class Login extends Component {
	render () {
		return (
      <Default meta={meta}>
				<Container>
					<LoginForm />
				</Container>
			</Default>
		);
	}
}

export default Login;
