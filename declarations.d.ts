declare namespace NodeJS {
	interface Global {
		fetch: (
			input: RequestInfo,
			init?: RequestInit | undefined,
		) => Promise<Response>;
	}

	interface Process {
		browser: boolean;
	}
}
