import React, { Component } from 'react'
import Error from 'next/error';
import Link from 'next/link';

import { ErrorProps } from '../api/models';

class CustomError extends Component<{ statusCode: number; }> {
  static getInitialProps ({ res, err }: ErrorProps) {
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    return { statusCode };
  }

  render () {
		const { statusCode } = this.props;
		const imgUrl = 'TODO:';

		if (statusCode == 404) {
			return (
				<div className="col-xs not-found-wrapper">
					<div className="white-box col-xs-12 col-sm-10 col-md-8 col-xl-6">
						<div className="row">
							<div className="text-xs-center col-xs-12">
								<h1>What have you done?!</h1>
							</div>
						</div>
						<div className="row">
							<div className="text-xs-center col-xs-12" style={{ marginBottom: '25px' }}>
								<img src={imgUrl} alt="Okay, this part was us." className="not-found-img" />
							</div>
						</div>
						<div className="row">
							<div className="text-xs-center col-xs-12">
								<h4>Something has gone wrong. It might be because of you. It might be because of us.
								Either way, this is awkward.</h4>
							</div>
						</div>
						<div className="row">
							<div className="text-xs-center col-xs-12">
								<Link href="/">
									<a>Please click here to get us both out of this situation</a>
								</Link>
							</div>
						</div>
					</div>
				</div>
			);
		}

    return <Error statusCode={statusCode} />;
  }
}

export default CustomError;
