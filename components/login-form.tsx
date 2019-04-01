import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Button,
	Control,
	Field,
	FieldBody,
	FieldLabel,
	Help,
	Input,
	Label,
} from 'bloomer';
import {
	ErrorMessage,
	Field as FormikField,
	FieldProps,
	Formik,
	Form,
} from 'formik';
import Router from 'next/router';
import React, { ComponentType, MouseEvent } from 'react';
import { adopt } from 'react-adopt';
import { MutationFn, MutationResult } from 'react-apollo';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { AuthConsumer, LoginArgs } from './auth';

import { RenderProp } from '../api/models';
import {
	WriteLoginLogMutation,
	WriteLoginLogData,
	WriteLoginLogVars,
} from '../api/mutations';
import { displayError, getFormControlOutlineColor } from '../api/utilities';

export interface LoginFormProps {
	email: string;
	password: string;
}

interface LoginFormRenderProps {
	auth: {
		forgotPassword: (email: string) => Promise<void>;
		login: (creds: LoginArgs) => Promise<string>;
	};
	writeLoginLog: {
		mutation: MutationFn<WriteLoginLogData, WriteLoginLogVars>;
		result: MutationResult<WriteLoginLogData>;
	};
}

const auth = ({ render }: RenderProp): JSX.Element => (
	<AuthConsumer>{context => render && render(context)}</AuthConsumer>
);
const writeLoginLog = ({ render }: RenderProp): JSX.Element => (
	<WriteLoginLogMutation>
		{(mutation, result) => render && render({ mutation, result })}
	</WriteLoginLogMutation>
);
const Composed = adopt<LoginFormRenderProps, {}>({
	auth,
	writeLoginLog,
});

const LoginForm: ComponentType<LoginFormProps> = ({
	email = '',
	password = '',
}): JSX.Element => (
	<Composed>
		{({ auth: { forgotPassword, login }, writeLoginLog }) => (
			<Formik
				initialValues={{ email, password }}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email('Please enter a valid email')
						.required('Email address is required'),
					password: Yup.string()
						.min(6, 'Password must be at least 6 characters')
						.required('Please enter a password'),
				})}
				onSubmit={async ({ email, password }, { setStatus, setSubmitting }) => {
					try {
						const userID = await login({ email, password });

						setStatus('');
						setSubmitting(false);
						toast.success('Welcome back!');
						writeLoginLog
							.mutation({ variables: { action: 'LOGIN', message: '', userID } })
							.catch(displayError);
						Router.push('/');
					} catch (err) {
						setStatus(err);
						setSubmitting(false);

						switch (err.code) {
							case 'UserNotConfirmedException':
								displayError('Please confirm your email address', {
									type: 'info',
								});
								Router.push(`/confirm?email=${email}`, '/confirm');

								return;
							case 'PasswordResetRequiredException':
								console.error('need pw reset', err);

								break;
							case 'UserNotFoundException':
								displayError(
									'User not found!  Did you mean to register using the button at the bottom right of this page instead?',
									{ type: 'warning' }
								);

								break;
							default:
								console.error('Uncaught error from auth', err);
								displayError(err.message, { type: 'warning' });

								break;
						}

						writeLoginLog
							.mutation({
								variables: {
									action: 'LOGIN',
									message: `${email} failed to sign in${
										err.message ? `: ${err.message}` : ''
									}`,
									userID: null,
								},
							})
							.catch(displayError);
					}
				}}>
				{({ values, touched, errors, status, isSubmitting, setStatus }) => {
					const switchToRegistration = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean> => {
						const { email, password } = values;

						ev.preventDefault();

						return Router.push(
							`/register?email=${email}&password=${password}`,
							'/register'
						);
					};

					const callForgotPassword = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean | void> => {
						const { email } = values;

						ev.preventDefault();

						if (!email) {
							displayError(
								'Please enter the email address you registered with to use forgot password',
								{ type: 'warning' }
							);

							return Promise.resolve();
						}

						return forgotPassword(email)
							.then(() => Router.push(`/forgot?email=${email}`, '/forgot'))
							.catch((err: Error) => setStatus(err));
					};

					return (
						<Form>
							{status && (
								<Help isColor="danger">{status.message || status}</Help>
							)}
							<Field isHorizontal>
								<FieldLabel isNormal isMarginless>
									<Label>Email&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<FormikField
												name="email"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.email,
															isTouched: !!touched.email,
														})}
														type="email"
														required
														autoFocus
														placeholder="Email Address"
													/>
												)}
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="user" />
											</span>
										</Control>
									</Field>
									<ErrorMessage
										className="is-danger"
										component={Help}
										name="email"
									/>
								</FieldBody>

								<FieldLabel isNormal isMarginless>
									<Label>&nbsp;Password&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<FormikField
												name="password"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.password,
															isTouched: !!touched.password,
														})}
														type="password"
														required
														placeholder="Password"
													/>
												)}
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="lock" />
											</span>
										</Control>
									</Field>
									<ErrorMessage
										className="is-danger"
										component={Help}
										name="password"
									/>
								</FieldBody>
								<Field isGrouped>
									<FieldLabel />
									<Control>
										<Button
											type="submit"
											isLoading={isSubmitting}
											isColor="info">
											Login
										</Button>
									</Control>
									<Control>
										<Button
											type="button"
											isColor="primary"
											href="/register"
											onClick={switchToRegistration}>
											Register
										</Button>
									</Control>
									<Control>
										<Button
											type="button"
											isColor="warning"
											onClick={callForgotPassword}>
											Forgot Password
										</Button>
									</Control>
								</Field>
							</Field>
						</Form>
					);
				}}
			</Formik>
		)}
	</Composed>
);

export default LoginForm;
