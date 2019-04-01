// eslint-disable-next-line import/named
import { ISignUpResult } from 'amazon-cognito-identity-js';
import {
	Button,
	Control,
	Field,
	Help,
	Input,
	Label,
	FieldLabel,
	FieldBody,
	Select,
} from 'bloomer';
import {
	ErrorMessage,
	Field as FormikField,
	FieldProps,
	Form,
	Formik,
	FormikActions,
} from 'formik';
import Router from 'next/router';
import React, { ComponentType, MouseEvent } from 'react';
import { adopt } from 'react-adopt';
import { MutationFn, MutationResult } from 'react-apollo';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { AuthConsumer, RegisterArgs } from './auth';

import { RenderProp, paymentTypes } from '../api/models';
import {
	RegisterUserMutation,
	WriteRegisterLogMutation,
	RegisterUserData,
	RegisterUserVars,
	WriteRegisterLogData,
	WriteRegisterLogVars,
} from '../api/mutations';
import { displayError, getFormControlOutlineColor } from '../api/utilities';

Yup.addMethod(Yup.string, 'sameAs', function (ref, message) {
	return this.test('sameAs', message, function (value) {
		let other = this.resolve(ref);

		return !other || !value || value === other;
	});
});

interface RegistrationFormRenderProps {
	auth: {
		forgotPassword: (email: string) => Promise<void>;
		register: (data: RegisterArgs) => Promise<ISignUpResult>;
	};
	registerUser: {
		mutation: MutationFn<RegisterUserData, RegisterUserVars>;
		result: MutationResult<RegisterUserData>;
	};
	writeRegisterLog: {
		mutation: MutationFn<WriteRegisterLogData, WriteRegisterLogVars>;
		result: MutationResult<WriteRegisterLogData>;
	};
}

export interface RegistrationFormProps {
	email: string;
	password: string;
}

interface RegistrationFormValues {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	paymentOption: typeof paymentTypes[number];
	paymentAccount: string;
}

const auth = ({ render }: RenderProp): JSX.Element => (
	<AuthConsumer>{context => render && render(context)}</AuthConsumer>
);
const registerUser = ({ render }: RenderProp): JSX.Element => (
	<RegisterUserMutation>
		{(mutation, result) => render && render({ mutation, result })}
	</RegisterUserMutation>
);
const writeRegisterLog = ({ render }: RenderProp): JSX.Element => (
	<WriteRegisterLogMutation>
		{(mutation, result) => render && render({ mutation, result })}
	</WriteRegisterLogMutation>
);

const Composed = adopt<RegistrationFormRenderProps, {}>({
	auth,
	registerUser,
	writeRegisterLog,
});

const RegistrationForm: ComponentType<RegistrationFormProps> = ({
	email = '',
	password = '',
}): JSX.Element => (
	<Composed>
		{({
			auth: { forgotPassword, register },
			registerUser,
			writeRegisterLog,
		}) => (
			<Formik
				initialValues={{
					email,
					password,
					confirmPassword: '',
					firstName: '',
					lastName: '',
					paymentOption: 'CASH',
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
						//@ts-ignore
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
					}: RegistrationFormValues,
					{ setSubmitting }: FormikActions<RegistrationFormValues>
				) => {
					register({ email, firstName, lastName, password })
						.then(({ userSub }) =>
							registerUser.mutation({
								variables: {
									fullName: `${firstName} ${lastName}`,
									paymentAccount: paymentAccount || null,
									paymentOption,
									userID: userSub,
								},
							})
						)
						.then(mutationResult => {
							setSubmitting(false);
							toast.success('Thanks for registering');

							if (mutationResult && mutationResult.data) {
								const { addUser } = mutationResult.data;

								writeRegisterLog
									.mutation({
										variables: {
											action: 'REGISTER',
											message: '',
											userID: addUser.id,
										},
									})
									.catch((err: Error) => displayError(err.message));
							}

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
						<Form>
							<Field isHorizontal>
								<FieldLabel isNormal>
									<Label>Email</Label>
								</FieldLabel>
								<FieldBody>
									<Field>
										<Control>
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
										</Control>
										<ErrorMessage className="is-danger" name="email" />
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
										</Control>
										<ErrorMessage className="is-danger" name="password" />
									</Field>

									<Field>
										<Control>
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
														placeholder="Confirm Password"
													/>
												)}
											/>
										</Control>
										<ErrorMessage
											className="is-danger"
											name="confirmPassword"
										/>
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
											<FormikField
												name="firstName"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.firstName,
															isTouched: !!touched.lastName,
														})}
														type="text"
														required
														placeholder="First Name"
													/>
												)}
											/>
										</Control>
										<ErrorMessage className="is-danger" name="firstName" />
									</Field>

									<Field>
										<Control>
											<FormikField
												name="lastName"
												render={({ field }: FieldProps) => (
													<Input
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.lastName,
															isTouched: !!touched.lastName,
														})}
														type="text"
														required
														placeholder="Last Name"
													/>
												)}
											/>
										</Control>
										<ErrorMessage className="is-danger" name="lastName" />
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
											<FormikField
												name="paymentOption"
												render={({ field }: FieldProps) => (
													<Select
														{...field}
														isColor={getFormControlOutlineColor({
															hasError: !!errors.paymentOption,
															isTouched: !!touched.paymentOption,
														})}
														required>
														<option value="">-- Select Type --</option>
														<option value="CASH">Cash</option>
														<option value="PAYPAL">Paypal</option>
														<option value="VENMO">Venmo</option>
														<option value="ZELLE">Zelle</option>
													</Select>
												)}
											/>
										</Control>
										<ErrorMessage className="is-danger" name="paymentOption" />
									</Field>

									<Field>
										<Control>
											{values.paymentOption && values.paymentOption !== 'CASH' && (
												<FormikField
													name="paymentAccount"
													render={({ field }: FieldProps) => (
														<Input
															{...field}
															isColor={getFormControlOutlineColor({
																hasError: !!errors.paymentAccount,
																isTouched: !!touched.paymentAccount,
															})}
															type="text"
															required
															placeholder="Account"
														/>
													)}
												/>
											)}
										</Control>
										<ErrorMessage className="is-danger" name="paymentAccount" />
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
						</Form>
					);
				}}
			</Formik>
		)}
	</Composed>
);

export default RegistrationForm;
