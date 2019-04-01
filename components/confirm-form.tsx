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
	Form,
	Formik,
} from 'formik';
import Router from 'next/router';
import React, { ComponentType, MouseEvent } from 'react';
import * as Yup from 'yup';

import { AuthConsumer } from './auth';

import { displayError, getFormControlOutlineColor } from '../api/utilities';

interface ConfirmFormProps {
	email: string;
}

const ConfirmForm: ComponentType<ConfirmFormProps> = ({
	email = '',
}): JSX.Element => (
	<AuthConsumer>
		{({ confirmEmail, resendCode }) => (
			<Formik
				initialValues={{ code: '', email }}
				validationSchema={Yup.object().shape({
					code: Yup.string().required('Please enter code emailed to you'),
					email: Yup.string()
						.email('Please enter a valid email')
						.required('Email address is required'),
				})}
				onSubmit={async ({ code, email }, { setStatus, setSubmitting }) => {
					try {
						await confirmEmail(email, code);

						setStatus('');
						setSubmitting(false);
						Router.push('/');
					} catch (err) {
						console.error(err);
						setStatus(err);
						setSubmitting(false);
						displayError(err.message, { type: 'warning' });
					}
				}}>
				{({ values, touched, errors, status, isSubmitting, setStatus }) => {
					const switchToLogin = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean> => {
						const { email } = values;

						ev.preventDefault();

						return Router.push(`/login?email=${email}`, '/login');
					};

					const resendConfirmationCode = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean | void> => {
						const { email } = values;

						ev.preventDefault();

						if (!email) {
							displayError('Please enter the email address to confirm', {
								type: 'warning',
							});

							return Promise.resolve();
						}

						return resendCode(email)
							.then(
								() =>
									!!displayError(
										'Code has been resent to email address provided.  Please check your email soon as this code expires.',
										{ type: 'success' }
									)
							)
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
									<ErrorMessage className="is-danger" name="email" />
								</FieldBody>

								<FieldLabel isNormal isMarginless>
									<Label>&nbsp;Code&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<FormikField
												name="code"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.code,
															isTouched: !!touched.code,
														})}
														type="text"
														required
														placeholder="Confirmation Code"
													/>
												)}
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="key" />
											</span>
										</Control>
									</Field>
									<ErrorMessage className="is-danger" name="code" />
								</FieldBody>

								<Field isGrouped>
									<FieldLabel />
									<Control>
										<Button
											type="submit"
											isLoading={isSubmitting}
											isColor="info">
											Submit
										</Button>
									</Control>
									<Control>
										<Button
											type="button"
											isColor="primary"
											onClick={resendConfirmationCode}>
											Resend Code
										</Button>
									</Control>
									<Control>
										<Button
											type="button"
											isColor="warning"
											href="/login"
											onClick={switchToLogin}>
											Back to Login
										</Button>
									</Control>
								</Field>
							</Field>
						</Form>
					);
				}}
			</Formik>
		)}
	</AuthConsumer>
);

export default ConfirmForm;
