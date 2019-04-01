import { Request, Response, Router } from 'express';
import { Component } from 'react';
import { ChildrenFn } from 'react-adopt';

export type Lit = string | number | boolean | undefined | null | void | {};

export const tuple = <T extends Lit[]>(...args: T): T => args;

export const imagesFor404 = tuple(
	'dany-tyrion-laugh.jpg',
	'dogs.jpg',
	'helmet.jpg',
	'know-nothing.gif',
	'kristen-wig.jpg',
	'red-wedding.jpg',
	'sansa-crush.jpg',
	'snow-dragons.gif',
	'tormun-brienne.jpg',
);

export const logActions = tuple(
	'_404',
	'LOGIN',
	'LOGOUT',
	'PAID',
	'REGISTER',
	'SUBMIT',
);

export const paymentTypes = tuple('CASH', 'PAYPAL', 'VENMO', 'ZELLE');

export const pointArr = tuple(1, 2, 3, 4, 5, 6, 7);

export const yesNo = tuple('N', 'Y');

export interface Character {
	id: number;
	name: string;
	img: string;
	alive: typeof yesNo[number];
}

export interface Context {
	asPath: string;
	Component: Component;
	err: Error;
	jsonPageRes: {
		[id: string]: string;
	};
	pathname: string;
	query: {
		[id: string]: string;
	};
	req: Request;
	res: Response;
	router: Router;
}

export interface Log {
	id: number;
	user: User;
	message: string;
	action: typeof logActions[number];
	time: string;
}

export interface Pick {
	id: number;
	user: User;
	points: typeof pointArr[number];
	character: Character;
}

export interface RenderProp {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	render?: ChildrenFn<any> | undefined;
}

export interface User {
	id: string;
	name: string;
	paid: typeof yesNo[number];
	paymentOption: typeof paymentTypes[number];
	paymentAccount?: string;
	tiebreaker: number | null;
	submitted: typeof yesNo[number];
	picks: Pick[];
	score: number;
}
