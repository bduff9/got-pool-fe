import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

import { S3_URL } from '../api/constants';

class CustomDoc extends Document {
	public render (): JSX.Element {
		return (
			<html lang="en">
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<link
						rel="icon"
						type="image/x-icon"
						href={`${S3_URL}/images/favicon.ico`}
					/>
					<meta name="theme-color" content="#52575C" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}

export default CustomDoc;
