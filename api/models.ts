import { Request, Response, Router } from 'express';
import { Component } from 'react';

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

export interface User {
	id: string;
	name: string;
	paid: 'Y' | 'N';
	paymentOption: string;
	paymentAccount?: string;
	points: number;
	tiebreaker: number;
	submitted: 'Y' | 'N';
}
