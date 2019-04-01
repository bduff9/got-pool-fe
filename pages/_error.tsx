import { Column, Columns, Container, Image, Title } from 'bloomer';
import Error from 'next/error';
import Link from 'next/link';
import React, { Component, useEffect } from 'react';
import { MutationFn } from 'react-apollo';

import { S3_URL } from '../api/constants';
import { Context, imagesFor404 } from '../api/models';
import {
	Write404LogMutation,
	Write404LogData,
	Write404LogVars,
} from '../api/mutations';
import { displayError } from '../api/utilities';
import Default from '../layouts/default';

interface CustomerErrorProps {
	imgUrl: string;
	path: string;
	statusCode: number;
}

interface Write404LogProps {
	mutate: MutationFn<Write404LogData, Write404LogVars>;
}

const Write404Log = ({ mutate }: Write404LogProps): null => {
	useEffect(() => {
		mutate().catch(displayError);
	}, [mutate]);

	return null;
};

class CustomError extends Component<CustomerErrorProps> {
	public static async getInitialProps ({
		res,
		asPath,
	}: Context): Promise<CustomerErrorProps> {
		const statusCode = res ? res.statusCode : 500;
		const max = imagesFor404.length;
		const number = Math.floor(Math.random() * max);
		const imgUrl = imagesFor404[number];

		return { imgUrl, path: asPath, statusCode };
	}

	public render (): JSX.Element {
		const { imgUrl, path, statusCode } = this.props;

		if (statusCode == 404) {
			return (
				<Default meta={{ title: `Error ${statusCode}` }}>
					<Write404LogMutation variables={{ action: '_404', message: path }}>
						{mutate => <Write404Log mutate={mutate} />}
					</Write404LogMutation>
					<Container>
						<Columns>
							<Column>
								<Title isSize={1}>What have you done?</Title>
							</Column>
							<Column>
								<Image
									src={`${S3_URL}/404/${imgUrl}`}
									alt="Okay, this part was us."
								/>
							</Column>
							<Column>
								Something has gone wrong. It might be because of you. It might
								be because of us. Either way, this is awkward.
								<br />
								<br />
								<Link href="/">
									<a>Please click here to get us both out of this situation</a>
								</Link>
							</Column>
						</Columns>
					</Container>
				</Default>
			);
		}

		return <Error statusCode={statusCode} />;
	}
}

export default CustomError;
