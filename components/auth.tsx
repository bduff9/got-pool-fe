import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

const AuthContext = React.createContext({});

class AuthProvider extends Component {

	componentDidMount () {
		Auth.currentAuthenticatedUser()
			.then((user: CognitoUser) => {
				this.setState({ isSignedIn: true, loading: false, user });
			})
			.catch((err: Error) => {
				console.error('Error in getting current user', err);
				this.setState({ isSignedIn: false, loading: false, user: null });
			});
	}

	forgotPassword = (email: string) => Auth.forgotPassword(email);

	login = async ({ email, password }: { email: string, password: string }) => {
		try {
			const user = await Auth.signIn(email, password);
			let loggedUser;
			let code = '';

			switch (user.challengeName) {
				case 'SMS_MFA':
				case 'SOFTWARE_TOKEN_MFA':
					loggedUser = await Auth.confirmSignIn(user, code, user.challengeName);

					this.setState({ isSignedIn: true, loading: false, user: loggedUser });

					return Promise.resolve('');
				case 'NEW_PASSWORD_REQUIRED':
					loggedUser = await Auth.completeNewPassword(user, password, {
						email,
					});

					this.setState({ isSignedIn: true, loading: false, user: loggedUser });

					return Promise.resolve('');
				case 'MFA_SETUP':
					return Auth.setupTOTP(user);
				default:
					this.setState({ isSignedIn: true, loading: false, user });

					return Promise.resolve('');
			}
		} catch (err) {
			switch (err.code) {
				case 'UserNotConfirmedException':
					console.error('TODO', err);

					return Promise.reject(err.message);
				case 'PasswordResetRequiredException':
					console.error('TODO', err);

					return Promise.reject(err.message);
				default:
					console.error('TODO', err);

					return Promise.reject(err.message || err);
			}
		}
	};

	logout = () => Auth.signOut()
		.then(() => this.setState({ isSignedIn: false, user: null }));

	state = {
		forgotPassword: this.forgotPassword,
		isSignedIn: false,
		loading: true,
		login: this.login,
		logout: this.logout,
		user: null,
	};

	render () {
		return (
			<AuthContext.Provider
				value={{
					...this.state,
					forgotPassword: this.forgotPassword,
					login: this.login,
					logout: this.logout,
				}}
			>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
