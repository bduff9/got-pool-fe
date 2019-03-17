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
import { Formik } from 'formik';
import Router from 'next/router';
import React, { ComponentType, MouseEvent } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { displayError, getFormControlOutlineColor } from '../api/utilities';
import { AuthConsumer } from './auth';

Yup.addMethod(Yup.string, 'sameAs', function (ref, message) {
	return this.test('sameAs', message, function (value) {
		let other = this.resolve(ref);

		return !other || !value || value === other;
	});
});

const ForgotPasswordForm: ComponentType<{ email: string }> = ({
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
				{({
					values,
					touched,
					errors,
					status,
					handleChange,
					handleSubmit,
					handleBlur,
					isSubmitting,
				}) => {
					const switchToLogin = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean> => {
						const { email } = values;

						ev.preventDefault();

						return Router.push(`/login?email=${email}`, '/login');
					};

					return (
						<form onSubmit={handleSubmit}>
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
									<Label className="nowrap">
										&nbsp;Confirmation Code&nbsp;
									</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.code,
													isTouched: !!touched.code,
												})}
												type="text"
												required
												name="code"
												value={values.code}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Confirmation Code"
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="key" />
											</span>
										</Control>
									</Field>
									{errors.code && touched.code && (
										<Help isColor="danger">{errors.code}</Help>
									)}
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel isNormal isMarginless>
									<Label className="nowrap">New Password&nbsp;</Label>
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
												placeholder="New Password"
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

								<FieldLabel isNormal isMarginless>
									<Label className="nowrap">&nbsp;Confirm Password&nbsp;</Label>
								</FieldLabel>
								<FieldBody>
									<Field isGrouped>
										<Control isExpanded hasIcons="left">
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.confirmPassword,
													isTouched: !!touched.confirmPassword,
												})}
												type="password"
												required
												name="confirmPassword"
												value={values.confirmPassword}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Confirm New Password"
											/>
											<span className="icon is-small is-left">
												<FontAwesomeIcon icon="lock" />
											</span>
										</Control>
									</Field>
									{errors.confirmPassword && touched.confirmPassword && (
										<Help isColor="danger">{errors.confirmPassword}</Help>
									)}
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
						</form>
					);
				}}
			</Formik>
		)}
	</AuthConsumer>
);

export default ForgotPasswordForm;
