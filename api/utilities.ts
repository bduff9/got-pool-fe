import { ReactElement } from 'react';
import { toast, ToastOptions } from 'react-toastify';

import { User } from './models';

export const displayError = (errorContent: string | ReactElement, opts: ToastOptions = { type: 'error' }) => {
	if (!errorContent) return;

	return toast(errorContent, opts);
};

export const getFormControlOutlineColor = ({ hasError, isTouched }: { hasError: boolean, isTouched: boolean }) => {
	if (!isTouched) return '';

	if (hasError) return 'danger';

	return 'success';
};

export const getSortUsersByPoints = (charactersDead: number) => (user1: User, user2: User) => {
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
