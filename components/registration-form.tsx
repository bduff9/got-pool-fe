import {
	Button,
	Control,
	Field,
	Help,
	Input,
	Label,
	FieldLabel,
	FieldBody,
} from 'bloomer';
import { Formik } from 'formik';
import Router from 'next/router';
import React, { ComponentType, MouseEvent } from 'react';
import { FetchResult } from 'react-apollo';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { AuthConsumer } from './auth';

import { registerUserWrapper } from '../api/mutations';
import { displayError, getFormControlOutlineColor } from '../api/utilities';
import { Select } from 'bloomer/lib/elements/Form/Select';

Yup.addMethod(Yup.string, 'sameAs', function (ref, message) {
	return this.test('sameAs', message, function (value) {
		let other = this.resolve(ref);

		return !other || !value || value === other;
	});
});

const RegistrationForm: ComponentType<{
email: string;
password: string;
registerUser: (
	userID: string,
	fullName: string,
	paymentOption: string,
	account?: string | undefined
) => Promise<void | FetchResult<
{},
Record<string, any>,
Record<string, any>
>>;
writeRegisterLog: (
	userID: string
) => Promise<void | FetchResult<
{},
Record<string, any>,
Record<string, any>
>>;
}> = ({
	email = '',
	password = '',
	registerUser,
	writeRegisterLog,
}): JSX.Element => (
	<AuthConsumer>
		{({ forgotPassword, register }) => (
			<Formik
				initialValues={{
					email,
					password,
					confirmPassword: '',
					firstName: '',
					lastName: '',
					paymentOption: '',
					paymentAccount: '',
				}}
				validationSchema={Yup.object().shape({
					email: Yup.string()
						.email('Please enter a valid email')
						.required('Email address is required'),
					password: Yup.string()
						.min(6, 'Password must be at least 6 characters')
						.required('Please enter a password'),
					confirmPassword: Yup.string()
						.sameAs(Yup.ref('password'), 'Please enter the same password again')
						.required('Please enter the same password again'),
					firstName: Yup.string().required('Please enter your first name'),
					lastName: Yup.string().required('Please enter your last name'),
					paymentOption: Yup.string()
						.oneOf(['CASH', 'PAYPAL', 'VENMO', 'ZELLE'])
						.required('Please select a payment type'),
					paymentAccount: Yup.string().when(
						'paymentOption',
						(option: string, schema: Yup.StringSchema) => {
							switch (option) {
								case 'CASH':
									return schema.nullable().length(0);
								case 'PAYPAL':
								case 'ZELLE':
									return schema
										.email('Please enter a valid email')
										.required(
											'Please enter email associated with your account'
										);
								case 'VENMO':
									return schema.required(
										'Please enter username associated with your account'
									);
							}
						}
					),
				})}
				onSubmit={(
					{
						email,
						password,
						firstName,
						lastName,
						paymentAccount,
						paymentOption,
					},
					{ setSubmitting }
				) => {
					register({ email, firstName, lastName, password })
						.then(result =>
							registerUser(
								result.userSub,
								`${firstName} ${lastName}`,
								paymentOption,
								paymentAccount
							)
						)
						.then(({ data }) => {
							setSubmitting(false);
							toast.success('Thanks for registering');
							writeRegisterLog(data.addUser.id).catch((err: Error) =>
								displayError(err.message)
							);
							Router.push(`/confirm?email=${email}`, '/confirm');
						})
						.catch((err: Error) => {
							displayError(err.message);
						});
				}}>
				{({
					values,
					touched,
					errors,
					error,
					handleChange,
					handleSubmit,
					handleBlur,
					isSubmitting,
					setStatus,
				}): JSX.Element => {
					const switchToLogin = (
						ev: MouseEvent<HTMLButtonElement>
					): Promise<boolean> => {
						const { email, password } = values;

						ev.preventDefault();

						return Router.push(
							`/login?email=${email}&password=${password}`,
							'/login'
						);
					};

					const callForgotPassword = async (
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
							<Field isHorizontal>
								<FieldLabel isNormal>
									<Label>Email</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.email,
													isTouched: !!touched.email,
												})}
												type="text"
												name="email"
												value={values.email}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Email Address"
											/>
										</Control>
										{errors.email && touched.email && (
											<Help isColor="danger">{errors.email}</Help>
										)}
									</Field>
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel isNormal>
									<Label>Password</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.password,
													isTouched: !!touched.password,
												})}
												type="password"
												name="password"
												value={values.password}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Password"
											/>
										</Control>
										{errors.password && touched.password && (
											<Help isColor="danger">{errors.password}</Help>
										)}
									</Field>

									<Field>
										<Control>
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.confirmPassword,
													isTouched: !!touched.confirmPassword,
												})}
												type="password"
												name="confirmPassword"
												value={values.confirmPassword}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Confirm Password"
											/>
										</Control>
										{errors.confirmPassword && touched.confirmPassword && (
											<Help isColor="danger">{errors.confirmPassword}</Help>
										)}
									</Field>
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel>
									<Label>Full Name</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.firstName,
													isTouched: !!touched.lastName,
												})}
												type="text"
												name="firstName"
												value={values.firstName}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="First Name"
											/>
										</Control>
										{errors.firstName && touched.firstName && (
											<Help isColor="danger">{errors.firstName}</Help>
										)}
									</Field>

									<Field>
										<Control>
											<Input
												isColor={getFormControlOutlineColor({
													hasError: !!errors.lastName,
													isTouched: !!touched.lastName,
												})}
												type="text"
												name="lastName"
												value={values.lastName}
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder="Last Name"
											/>
										</Control>
										{errors.lastName && touched.lastName && (
											<Help isColor="danger">{errors.lastName}</Help>
										)}
									</Field>
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel isNormal>
									<Label>Payment Account</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
											<Select
												isColor={getFormControlOutlineColor({
													hasError: !!errors.paymentOption,
													isTouched: !!touched.paymentOption,
												})}
												name="paymentOption"
												value={values.paymentOption}
												onChange={handleChange}>
												<option value="">-- Select Type --</option>
												<option value="CASH">Cash</option>
												<option value="PAYPAL">Paypal</option>
												<option value="VENMO">Venmo</option>
												<option value="ZELLE">Zelle</option>
											</Select>
										</Control>
										{errors.paymentOption && touched.paymentOption && (
											<Help isColor="danger">{errors.paymentOption}</Help>
										)}
									</Field>

									<Field>
										<Control>
											{values.paymentOption && values.paymentOption !== 'CASH' && (
												<Input
													isColor={getFormControlOutlineColor({
														hasError: !!errors.paymentAccount,
														isTouched: !!touched.paymentAccount,
													})}
													type="text"
													name="paymentAccount"
													value={values.paymentAccount}
													onChange={handleChange}
													onBlur={handleBlur}
													placeholder="Account"
												/>
											)}
										</Control>
										{errors.paymentAccount && touched.paymentAccount && (
											<Help isColor="danger">{errors.paymentAccount}</Help>
										)}
									</Field>
								</FieldBody>
							</Field>

							<Field isHorizontal>
								<FieldLabel />
								<FieldBody>
									<Field isGrouped>
										<Control>
											<Button
												type="submit"
												isLoading={isSubmitting}
												isColor="info">
												Register
											</Button>
										</Control>
										<Control>
											<Button
												type="button"
												isColor="primary"
												href="/login"
												onClick={switchToLogin}>
												Login
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
								</FieldBody>
							</Field>

							{error && error.message && (
								<Help isColor="danger">{error.message}</Help>
							)}
						</form>
					);
				}}
			</Formik>
		)}
	</AuthConsumer>
);

export default registerUserWrapper(RegistrationForm);
