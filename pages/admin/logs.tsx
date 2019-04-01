import React, { Component } from 'react';

import { LOGS_PER_PAGE } from '../../api/constants';
import { logActions, Context, Log } from '../../api/models';
import { GetLogsQuery } from '../../api/queries';
import { ensureAuthenticated, displayError } from '../../api/utilities';
import { Authenticated } from '../../layouts/authenticated';
import Default from '../../layouts/default';
import LogTable from '../../components/log-table';

const meta = { title: 'View Logs' };

interface AdminLogsState {
	action?: typeof logActions[number];
	userID?: string;
}

class AdminLogs extends Component<{}, AdminLogsState> {
	public static async getInitialProps ({
		req,
		res,
		query,
	}: Context): Promise<{}> {
		ensureAuthenticated(req, res);

		return query;
	}

	public state: AdminLogsState = {};

	private _filterByAction = (action: typeof logActions[number]): void => {
		const { action: oldAction } = this.state;

		if (action === oldAction) {
			this.setState({ action: undefined });
		} else {
			this.setState({ action });
		}
	};

	private _filterByUserID = (userID: string): void => {
		const { userID: oldUserID } = this.state;

		if (userID === oldUserID) {
			this.setState({ userID: undefined });
		} else {
			this.setState({ userID });
		}
	};

	public render (): JSX.Element {
		const { action, userID } = this.state;

		return (
			<Authenticated>
				<Default meta={meta} key={`action-${action}-userID-${userID}`}>
					<GetLogsQuery
						variables={{
							action,
							limit: LOGS_PER_PAGE,
							offset: 0,
							userID,
						}}
					>
						{({ data, error, fetchMore }) => {
							let logs: Log[] = [];
							let hasMore = false;
							let currentPage = 0;

							if (error) {
								displayError(error.message);

								return <div>Error loading data, please try again later</div>;
							}

							if (data && data.logs) {
								logs = data.logs.logs || [];

								if (data.logs.cursor) {
									currentPage = Math.ceil(logs.length / LOGS_PER_PAGE);

									hasMore = currentPage < data.logs.cursor.totalPages;
								}
							}

							return (
								<LogTable
									currentPage={currentPage}
									fetchMore={fetchMore}
									filterByAction={this._filterByAction}
									filterByUserID={this._filterByUserID}
									hasMore={hasMore}
									logs={logs}
								/>
							);
						}}
					</GetLogsQuery>
				</Default>
			</Authenticated>
		);
	}
}

export default AdminLogs;
