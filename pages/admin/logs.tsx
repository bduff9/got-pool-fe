import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Table } from 'bloomer';

import Default from '../../layouts/default';
import { LOGS_PER_PAGE } from '../../api/constants';
import Loading from '../../components/loading';
import GoTLog from '../collections/gotlogs';
import User from '../collections/users';

const meta = { title: 'View Logs' };

class AdminLogs extends Component {
	state = {
		action: '',
		logLimit: LOGS_PER_PAGE,
		subscriptions: {
			logs: Meteor.subscribe('allLogs'),
			users: Meteor.subscribe('allUsers')
		},
		user_id: ''
	};

	componentWillUnmount () {
		const { logs, users } = this.state.subscriptions;

		logs.stop();
		users.stop();
	}

	logs (action, user_id, limit) {
		const filter = {};

		if (action) filter.action = action;
		if (user_id) filter.user_id = user_id;
		return GoTLog.find(filter, { limit, sort: { when: -1 }}).fetch();
	}

	users () {
		return User.find({}).fetch();
	}

	_filterByAction (action, ev) {
		const { action: oldAction } = this.state;
		if (action === oldAction) {
			this.setState({ action: '' });
		} else {
			this.setState({ action });
		}
	}

	_filterByUserID (user_id, ev) {
		const { user_id: oldUser_id } = this.state;
		if (user_id === oldUser_id) {
			this.setState({ user_id: '' });
		} else {
			this.setState({ user_id });
		}
	}

	_loadMoreLogs () {
		const { logLimit } = this.state,
				newLogLimit = logLimit + LOGS_PER_PAGE;
		this.setState({ logLimit: newLogLimit });
	}

	render () {
		const { action, logLimit, subscriptions, user_id } = this.state,
				{ logs, users } = subscriptions,
				pageReady = logs.ready() && users.ready(),
				theLogs = this.logs(action, user_id, logLimit),
				hasMore = theLogs.length === logLimit;

		return (
			<Default meta={meta}>
				<Loading isLoading={!pageReady}>
					<InfiniteScroll pageStart={0} hasMore={hasMore} loader={<Loading isLoading={true} />} loadMore={this._loadMoreLogs}>
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
											<i className="fa fa-filter" style={{ cursor: 'pointer' }} onClick={this._filterByAction.bind(null, log.action)} />
										</td>
										<td>
											{log.user_id ? `${log.getUser().first_name} ${log.getUser().last_name}` : null}
											{log.user_id ? <i className="fa fa-filter" style={{ cursor: 'pointer' }} onClick={this._filterByUserID.bind(null, log.user_id)} /> : null}
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
