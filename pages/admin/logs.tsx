import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Table } from 'bloomer';
import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import { LOGS_PER_PAGE } from '../../api/constants';
import Loading from '../../components/loading';
import Default from '../../layouts/default';
import GoTLog from '../collections/gotlogs';
import User from '../collections/users';

const meta = { title: 'View Logs' };

class AdminLogs extends Component {
	public state = {
		action: '',
		logLimit: LOGS_PER_PAGE,
		subscriptions: {
			logs: Meteor.subscribe('allLogs'),
			users: Meteor.subscribe('allUsers'),
		},
		user_id: '',
	};

	public componentWillUnmount (): void {
		const { logs, users } = this.state.subscriptions;

		logs.stop();
		users.stop();
	}

	private logs (action, user_id, limit): any[] {
		const filter = {};

		if (action) filter.action = action;

		if (user_id) filter.user_id = user_id;

		return GoTLog.find(filter, { limit, sort: { when: -1 } }).fetch();
	}

	private users (): any[] {
		return User.find({}).fetch();
	}

	private _filterByAction (action, ev): void {
		const { action: oldAction } = this.state;

		if (action === oldAction) {
			this.setState({ action: '' });
		} else {
			this.setState({ action });
		}
	}

	private _filterByUserID (user_id, ev): void {
		const { user_id: oldUser_id } = this.state;

		if (user_id === oldUser_id) {
			this.setState({ user_id: '' });
		} else {
			this.setState({ user_id });
		}
	}

	private _loadMoreLogs (): void {
		const { logLimit } = this.state;
		const newLogLimit = logLimit + LOGS_PER_PAGE;

		this.setState({ logLimit: newLogLimit });
	}

	public render (): JSX.Element {
		const { action, logLimit, subscriptions, user_id } = this.state;
		const { logs, users } = subscriptions;
		const pageReady = logs.ready() && users.ready();
		const theLogs = this.logs(action, user_id, logLimit);
		const hasMore = theLogs.length === logLimit;

		return (
			<Default meta={meta}>
				<Loading isLoading={!pageReady}>
					<InfiniteScroll
						pageStart={0}
						hasMore={hasMore}
						loader={<Loading isLoading={true} />}
						loadMore={this._loadMoreLogs}>
						<Table>
							<thead>
								<tr>
									<th>Action</th>
									<th>User</th>
									<th>When</th>
									<th>Message</th>
								</tr>
							</thead>
							<tbody>
								{theLogs.map(log => (
									<tr key={`log${log._id}`}>
										<td>
											{log.action}
											<span
												className="icon"
												style={{ cursor: 'pointer' }}
												onClick={this._filterByAction.bind(null, log.action)}>
												<FontAwesomeIcon icon="filter" />
											</span>
										</td>
										<td>
											{log.user_id &&
												`${log.getUser().first_name} ${
													log.getUser().last_name
												}`}
											{log.user_id && (
												<span
													className="icon"
													style={{ cursor: 'pointer' }}
													onClick={this._filterByUserID.bind(
														null,
														log.user_id
													)}>
													<FontAwesomeIcon icon="filter" />
												</span>
											)}
										</td>
										<td>{log.when.toString()}</td>
										<td>{log.message}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</InfiniteScroll>
				</Loading>
			</Default>
		);
	}
}

export default AdminLogs;
