export interface ErrorProps {
	res: { statusCode: number; };
	err: { statusCode: number; };
};

export interface User {
	points: number;
	tiebreaker: number;
};
