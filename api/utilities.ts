import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { ReactElement } from 'react';
import { toast, ToastOptions } from 'react-toastify';

import jwks from './jwks';
import { User } from './models';

export const displayError = (
	errorContent: string | ReactElement,
	opts: ToastOptions = { type: 'error' }
): number | null => {
	if (!errorContent) return null;

	return toast(errorContent, opts);
};

const isAuthed = (idToken: string): boolean => {
	if (idToken) {
		try {
			const pem = jwkToPem(jwks.keys[0]);
			const user = jwt.verify(idToken, pem);

			if (user) return true;
		} catch (err) {
			console.error('Failed to auth server side', err.message);
		}
	}

	return false;
};

export const ensureAuthenticated = (
	request: Request,
	response: Response
): boolean => {
	const idToken = request && request.cookies && request.cookies.authentication;

	if (isAuthed(idToken)) return true;

	if (response) {
		response.writeHead(302, {
			Location: '/login',
		});
		response.end();
	}

	return false;
};

export const ensureUnauthenticated = (
	request: Request,
	response: Response
): boolean => {
	const idToken = request && request.cookies && request.cookies.authentication;

	if (!isAuthed(idToken)) return true;

	if (response) {
		response.writeHead(302, {
			Location: '/',
		});
		response.end();
	}

	return false;
};

export const getFormControlOutlineColor = ({
	hasError,
	isTouched,
}: {
	hasError: boolean;
	isTouched: boolean;
}): string => {
	if (!isTouched) return '';

	if (hasError) return 'danger';

	return 'success';
};

export const getSortUsersByPoints = (
	charactersDead: number
): ((u1: User, u2: User) => number) => (user1: User, user2: User): number => {
	const pointsDiff = user2.points - user1.points;
	const tb1 = charactersDead - user1.tiebreaker;
	const tb2 = charactersDead - user2.tiebreaker;
	const tbDiff = Math.abs(tb1) - Math.abs(tb2);

	// First, sort by points
	if (pointsDiff !== 0) return pointsDiff;

	// Next, sort by tiebreakers (if one person is over, they come second)
	if (tb1 >= 0 && tb2 < 0) return -1;

	if (tb1 < 0 && tb2 >= 0) return 1;

	// If both are over/under, take the abs value and then the lower one comes first
	return tbDiff;
};
