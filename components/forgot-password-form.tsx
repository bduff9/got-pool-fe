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
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { AuthConsumer } from './auth';

import { displayError, getFormControlOutlineColor } from '../api/utilities';

Yup.addMethod(Yup.string, 'sameAs', function (ref, message) {
	return this.test('sameAs', message, function (value) {
		let other = this.resolve(ref);

		return !other || !value || value === other;
	});
});

interface ForgotPasswordFormProps {
	email: string;
}

const ForgotPasswordForm: ComponentType<ForgotPasswordFormProps> = ({
	email = '',
}): JSX.Element => (
	<AuthConsumer>
		{({ forgotPasswordSubmit }) => (
			<Formik
				initialValues={{ code: '', email, password: '', confirmPassword: '' }}
				validationSchema={Yup.object().shape({
					code: Yup.string().required('Please enter code emailed to you'),
					email: Yup.string()
						.email('Please enter a valid email')
						.required('Email address is required'),
					password: Yup.string()
						.min(6, 'Password must be at least 6 characters')
						.required('Please enter a password'),
					confirmPassword: Yup.string()
						//@ts-ignore
						.sameAs(Yup.ref('password'), 'Please enter the same password again')
						.required('Please enter the same password again'),
				})}
				onSubmit={async (
					{ code, email, password },
					{ setStatus, setSubmitting }
				) => {
					try {
						await forgotPasswordSubmit(email, code, password);

						setStatus('');
						setSubmitting(false);
						toast.success('Password successfully changed!');
						Router.push('/login');
					} catch (err) {
						setStatus(err);
						setSubmitting(false);
						displayError(err.message, { type: 'warning' });
					}
				}}>
				{({ values, touched, errors, status, isSubmitting }) => {
					const switchToLogin = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean> => {
						const { email } = values;

						ev.preventDefault();

						return Router.push(`/login?email=${email}`, '/login');
					};

					return (
						<Form>
							{status && (
								<Help isColor="danger">{status.message || status}</Help>
							)}
							<Field isHorizontal>
								<FieldLabel isNormal isMarginless>
									<Label className="nowrap">Email Address &nbsp;</Label>
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
									<Label className="nowrap">
										&nbsp;Confirmation Code&nbsp;
									</Label>
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
							</Field>

							<Field isHorizontal>
								<FieldLabel isNormal isMarginless>
									<Label className="nowrap">New Password&nbsp;</Label>
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
														placeholder="New Password"
													/>
												)}
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="lock" />
											</span>
										</Control>
									</Field>
									<ErrorMessage className="is-danger" name="password" />
								</FieldBody>

								<FieldLabel isNormal isMarginless>
									<Label className="nowrap">&nbsp;Confirm Password&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<FormikField
												name="confirmPassword"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.confirmPassword,
															isTouched: !!touched.confirmPassword,
														})}
														type="password"
														required
														placeholder="Confirm New Password"
													/>
												)}
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="lock" />
											</span>
										</Control>
									</Field>
									<ErrorMessage className="is-danger" name="confirmPassword" />
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel isNormal isMarginless />
								<FieldBody>
									<Field isGrouped>
										<Control>
											<Button
												type="submit"
												isLoading={isSubmitting}
												isColor="info">
												Change Password
											</Button>
										</Control>
										<Control>
											<Button
												type="button"
												isColor="primary"
												href="/login"
												onClick={switchToLogin}>
												Back to Login
											</Button>
										</Control>
									</Field>
								</FieldBody>
							</Field>
						</Form>
					);
				}}
			</Formik>
		)}
	</AuthConsumer>
);

export default ForgotPasswordForm;
