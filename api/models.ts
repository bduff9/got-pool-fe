import { Request, Response, Router } from 'express';
import { Component } from 'react';

export type Lit = string | number | boolean | undefined | null | void | {};

export const tuple = <T extends Lit[]>(...args: T): T => args;

export const pointArr = tuple(1, 2, 3, 4, 5, 6, 7);

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

export interface ErrorProps {
	res: { statusCode: number };
	err: { statusCode: number };
}

export interface Character {
	id: number;
	name: string;
	img: string;
	alive: 'N' | 'Y';
}

export interface Pick {
	id: number;
	user: User;
	points: typeof pointArr[number];
	character: Character;
}

export interface User {
	id: string;
	name: string;
	paid: 'Y' | 'N';
	paymentOption: string;
	paymentAccount?: string;
	points: number;
	tiebreaker: typeof pointArr[number];
	submitted: 'Y' | 'N';
}
