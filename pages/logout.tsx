import React, { Component } from 'react';
import Link from 'next/link';
import { Icon, Notification } from 'bloomer';

import Default from '../layouts/default';
import { displayError } from '../globals';
import { writeLog } from '../collections/gotlogs';

const meta = { title: 'Goodbye' };

class Logout extends Component {
	state = { authenticated: false };

	//TODO: write log

	render () {
		return (
			<Default meta={meta}>
				<div>
				{authenticated ? (
					<div>
						<Icon isSize="medium" isAlign="left">
							<i className="fa fa-spin fa-spinner" aria-hidden="true"/>
						</Icon>
						Logging you out...
					</div>
				)
					:
					(
						<Notification isColor="success">You are now logged out! <Link href="/login"><a>Click here to sign back in.</a></Link></Notification>
					)
				}
				</div>
			</Default>
		);
	}
}

export default Logout;
