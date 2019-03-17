import { CognitoUser } from '@aws-amplify/auth';
import { ISignUpResult, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import React, { Component } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
export const COOKIE_NAME = 'authentication';

export interface LoginArgs {
	email: string;
	password: string;
}

export interface RegisterArgs {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface AuthContextType {
	confirmEmail: (email: string, code: string) => Promise<any>;
	forgotPassword: (email: string) => Promise<void>;
	forgotPasswordSubmit: (email: string, code: string, newPassword: string) => Promise<void>;
	isSignedIn: boolean;
	loading: boolean;
	login: (creds: LoginArgs) => Promise<string>;
	logout: () => Promise<void>;
	register: (data: RegisterArgs) => Promise<ISignUpResult>;
	user: CognitoUser | null;
	resendCode: (email: string) => Promise<any>;
}

export const AuthContext = React.createContext<AuthContextType>({
	confirmEmail: (email: string, code: string) => Promise.resolve(email + code),
	forgotPassword: () => Promise.resolve(),
	forgotPasswordSubmit: (email: string, code: string, newPassword: string) => Promise.resolve(),
	isSignedIn: false,
	loading: true,
	login: (creds: LoginArgs) => Promise.resolve(creds.email),
	logout: () => Promise.resolve(),
	register: (creds: RegisterArgs) => Promise.resolve({} as any),
	resendCode: (email: string) => Promise.resolve(email),
	user: null,
});

class AuthProvider extends Component {
	public state = {
		isSignedIn: false,
		loading: true,
		user: null,
	};

	public componentDidMount (): void {
		Auth.currentAuthenticatedUser()
			.then((user: CognitoUser) => {
				this.setCookie();
				this.setState({ isSignedIn: true, loading: false, user });
			})
			.catch(() => {
				this.setState({ isSignedIn: false, loading: false, user: null });
			});
	}

	private confirmEmail = (email: string, code: string) => Auth.confirmSignUp(email, code).then(() => {
		Auth.currentAuthenticatedUser()
			.then((user: CognitoUser) => {
				this.setCookie();
				this.setState({ isSignedIn: true, loading: false, user });
			})
			.catch(() => {
				this.setState({ isSignedIn: false, loading: false, user: null });
			});
	});

	private forgotPassword = (email: string) => Auth.forgotPassword(email);

	private forgotPasswordSubmit = (email: string, code: string, newPassword: string) => Auth.forgotPasswordSubmit(email, code, newPassword);

	private getCognitoSub = (user: CognitoUser): Promise<string> => {
		return new Promise((resolve, reject) => {
			user.getUserAttributes((err: Error | undefined, attributes: CognitoUserAttribute[] | undefined): void => {
				if (err) {
					reject(err);
				} else {
					const sub = attributes ? attributes.filter(attribute => attribute.getName() === 'sub') : [];

					if (sub.length === 0) {
						reject(new Error('No "sub" attribute found'));
					} else {
						resolve(sub[0].getValue());
					}
				}
			});
		});
	};

	private login = async ({
		email,
		password,
	}: LoginArgs) => {
		try {
			const user = await Auth.signIn(email, password);
			let code = '';
			let userID;
			let loggedUser;

			switch (user.challengeName) {
				case 'SMS_MFA':
				case 'SOFTWARE_TOKEN_MFA':
					loggedUser = await Auth.confirmSignIn(user, code, user.challengeName);
					userID = await this.getCognitoSub(loggedUser);

					this.setCookie();
					this.setState({ isSignedIn: true, loading: false, user: loggedUser });

					return Promise.resolve(userID);
				case 'NEW_PASSWORD_REQUIRED':
					loggedUser = await Auth.completeNewPassword(user, password, {
						email,
					});
					userID = await this.getCognitoSub(loggedUser);

					this.setCookie();
					this.setState({ isSignedIn: true, loading: false, user: loggedUser });

					return Promise.resolve(userID);
				case 'MFA_SETUP':
					return Auth.setupTOTP(user);
				default:
					userID = await this.getCognitoSub(user);

					this.setCookie();
					this.setState({ isSignedIn: true, loading: false, user });

					return Promise.resolve(userID);
			}
		} catch (err) {
			return Promise.reject(err);
		}
	};

	private logout = () =>
		Auth.signOut().then(() => {
			cookies.remove(COOKIE_NAME);
			this.setState({ isSignedIn: false, user: null });
		});

	private register = ({
		email,
		firstName,
		lastName,
		password,
	}: RegisterArgs) =>
		Auth.signUp({
			username: email,
			password,
			attributes: {
				email,
				'family_name': lastName,
				'given_name': firstName,
			},
		});

	private resendCode = (email: string) => Auth.resendSignUp(email);

	private setCookie (): void {
		Auth.currentSession().then(session => {
			const idToken = session.getIdToken().getJwtToken();

			cookies.set(COOKIE_NAME, idToken, { path: '/' });
		});
	}

	public render (): JSX.Element {
		return (
			<AuthContext.Provider
				value={{
					...this.state,
					confirmEmail: this.confirmEmail,
					forgotPassword: this.forgotPassword,
					forgotPasswordSubmit: this.forgotPasswordSubmit,
					login: this.login,
					logout: this.logout,
					register: this.register,
					resendCode: this.resendCode,
				}}>
				{this.props.children}
			</AuthContext.Provider>
		);
	}
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
