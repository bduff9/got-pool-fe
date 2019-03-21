import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface LoadingProps {
	children?: JSX.Element | JSX.Element[] | string;
	isLoading: boolean;
}

const Loading = ({ children, isLoading }: LoadingProps): JSX.Element => (
	<div className="col">
		{isLoading ? (
			<div className="white-box col-xs-10 col-sm-10 col-md-6 col-xl-4">
				<div className="row">
					<div className="text-xs-center col-xs-12">
						<h3>
							Loading &nbsp; <FontAwesomeIcon icon="spinner" pulse />
						</h3>
					</div>
				</div>
			</div>
		) : (
			children
		)}
	</div>
);

export default Loading;
