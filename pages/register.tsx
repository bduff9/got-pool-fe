import React, { Component } from 'react';
import { Container } from 'bloomer';

import Default from '../layouts/default';
import RegistrationForm from '../components/registration-form';

const meta = { title: 'Register' };

class Register extends Component {
	render () {
		return (
      <Default meta={meta}>
				<Container>
					<RegistrationForm />
				</Container>
			</Default>
		);
	}
}

export default Register;
