import React from 'react';
import { Formik } from 'formik';
import Yup from 'yup';
import { toast } from 'react-toastify';
import { Button, Control, Field, FieldBody, FieldLabel, Help, Icon, Input, Label } from 'bloomer';

import { writeLog } from '../api/mutations';
import { displayError, getFormControlOutlineColor } from '../api/utilities';

const LoginForm = () => (
	<Formik
		initialValues={{ email: '', password: '' }}
		validate={values => {
			Yup.object().shape({
				email: Yup.string().email('Please enter a valid email').required('Email address is required'),
				password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter a password')
			})
		}}
		onSubmit={(payload, { props, setError, setSubmitting }) => {
			const { email, password } = payload;

			//Meteor.loginWithPassword(email, password, err => {
				if (err) {
					setError(err);
					setSubmitting(false);
					if (err.reason === 'User not found') {
						displayError('User not found!  Did you mean to register using the button at the bottom right of this page instead?', { type: 'warning' });
					} else {
						displayError(err, { title: err.reason, type: 'warning' });
					}
					//TODO: writeLog.call({ userId: '', action: 'LOGIN', message: `${email} failed to sign in` }, displayError);
				} else {
					toast.success('Welcome back!');
					//TODO: writeLog.call({ userId: Meteor.userId(), action: 'LOGIN' }, displayError);
				}
		//});
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
		}) => (
			<form onSubmit={handleSubmit}>
				<Field isHorizontal>
					<FieldLabel isNormal>
						<Label>Email</Label>
					</FieldLabel>
					<FieldBody>
						<Field isGrouped>
							<Control isExpanded hasIcons="left">
								<Input
									isColor={getFormControlOutlineColor({ hasError: !!errors.email, isTouched: !!touched.email })}
									type="text"
									name="email"
									value={values.email}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Email Address" />
								<Icon isSize="small" isAlign="left"><i className="fa fa-user" aria-hidden="true"/></Icon>
							</Control>
							{errors.email && touched.email && <Help isColor="danger">{errors.email}</Help>}
						</Field>
					</FieldBody>
					<FieldLabel isNormal>
						<Label>Password</Label>
					</FieldLabel>
					<FieldBody>
						<Field isGrouped>
							<Control isExpanded hasIcons="left">
								<Input
									isColor={getFormControlOutlineColor({ hasError: !!errors.password, isTouched: !!touched.password })}
									type="password"
									name="password"
									value={values.password}
									onChange={handleChange}
									onBlur={handleBlur}
									placeholder="Password" />
								<Icon isSize="small" isAlign="left"><i className="fa fa-lock" aria-hidden="true"/></Icon>
							</Control>
							{errors.password && touched.password && <Help isColor="danger">{errors.password}</Help>}
						</Field>
					</FieldBody>
					<Field isGrouped>
						<FieldLabel />
						<Control>
							<Button type="submit" isLoading={isSubmitting} isColor="primary">Login</Button>
						</Control>
						<Control>
							<Button type="button" isColor="info" onClick={() => console.error('TODO:')}>Register</Button>
						</Control>
					</Field>
					{error && error.message && <Help isColor="danger">{error.message}</Help>}
				</Field>
			</form>
		)}
	</Formik>
);

export default LoginForm;
