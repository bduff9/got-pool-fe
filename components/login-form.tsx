import React, { ComponentType, MouseEvent } from 'react';
import Router from 'next/router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FetchResult } from 'react-apollo';
import { toast } from 'react-toastify';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuthConsumer } from './auth';
import { writeLoginLogWrapper } from '../api/mutations';
import { displayError, getFormControlOutlineColor } from '../api/utilities';

const LoginForm: ComponentType<{
email: string;
password: string;
writeLoginLog: (
	userID: string | null,
	message?: string
) => Promise<void | FetchResult<
{},
Record<string, any>,
Record<string, any>
>>;
}> = ({ email = '', password = '', writeLoginLog }): JSX.Element => (
	<AuthConsumer>
		{({ forgotPassword, login }) => (
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
						writeLoginLog(userID).catch(displayError);
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

						writeLoginLog(
							null,
							`${email} failed to sign in${
								err.message ? `: ${err.message}` : ''
							}`
						).catch(displayError);
					}
				}}>
				{({
					values,
					touched,
					errors,
					status,
					handleChange,
					handleSubmit,
					handleBlur,
					isSubmitting,
					setStatus,
				}) => {
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
						<form onSubmit={handleSubmit}>
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
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.email,
													isTouched: !!touched.email,
												})}
												type="email"
												required
												autoFocus
												name="email"
												value={values.email}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Email Address"
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="user" />
											</span>
										</Control>
									</Field>
									{errors.email && touched.email && (
										<Help isColor="danger">{errors.email}</Help>
									)}
								</FieldBody>

								<FieldLabel isNormal isMarginless>
									<Label>&nbsp;Password&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.password,
													isTouched: !!touched.password,
												})}
												type="password"
												required
												name="password"
												value={values.password}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Password"
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="lock" />
											</span>
										</Control>
									</Field>
									{errors.password && touched.password && (
										<Help isColor="danger">{errors.password}</Help>
									)}
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
						</form>
					);
				}}
			</Formik>
		)}
	</AuthConsumer>
);

export default writeLoginLogWrapper(LoginForm);
