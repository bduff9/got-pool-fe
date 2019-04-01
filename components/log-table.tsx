import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	FetchMoreQueryOptions,
	FetchMoreOptions,
	ApolloQueryResult,
} from 'apollo-client';
import { Table } from 'bloomer';
import { parse } from 'date-fns';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import Loading from './loading';

import { LOGS_PER_PAGE } from '../api/constants';
import { Log, logActions } from '../api/models';
import { GetLogsVars, GetLogsData } from '../api/queries';

interface LogTableProps {
	currentPage: number;
	fetchMore: <K extends 'action' | 'userID' | 'limit' | 'offset'>(
		fetchMoreOptions: FetchMoreQueryOptions<GetLogsVars, K> &
		FetchMoreOptions<GetLogsData, GetLogsVars>,
	) => Promise<ApolloQueryResult<GetLogsData>>;
	filterByAction: (action: typeof logActions[number]) => void;
	filterByUserID: (userID: string) => void;
	hasMore: boolean;
	logs: Log[];
}

const LogTable = ({
	currentPage,
	fetchMore,
	filterByAction,
	filterByUserID,
	hasMore,
	logs,
}: LogTableProps): JSX.Element => {
	return (
		<InfiniteScroll
			hasMore={hasMore}
			loader={
				<Loading isLoading key={`loader-for-log-page-${currentPage + 1}`} />
			}
			loadMore={() =>
				fetchMore({
					variables: {
						limit: LOGS_PER_PAGE,
						offset: logs.length,
					},
					updateQuery: (prev, { fetchMoreResult }) => {
						if (!fetchMoreResult) return prev;

						const logs = prev.logs.logs;

						fetchMoreResult.logs.logs.forEach(log => {
							const { id } = log;
							const matches = logs.filter(({ id: oldID }) => oldID === id);

							if (matches.length === 0) logs.push(log);
						});

						return {
							...prev,
							logs: {
								...prev.logs,
								logs,
								cursor: fetchMoreResult.logs.cursor,
							},
						};
					},
				})
			}
			pageStart={0}
		>
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
					{logs.map(log => (
						<tr key={`log-${log.id}`}>
							<td className="nowrap">
								<span
									className="clickable"
									onClick={() => filterByAction(log.action)}
								>
									<FontAwesomeIcon icon="filter" />
								</span>
								{' ' + log.action}
							</td>
							<td className="nowrap">
								{log.user && (
									<span
										className="clickable"
										onClick={() => filterByUserID(log.user.id)}
									>
										<FontAwesomeIcon icon="filter" />
									</span>
								)}
								{log.user && ` ${log.user.name}`}
							</td>
							<td className="nowrap">
								{parse(log.time, 'T', new Date()).toLocaleString()}
							</td>
							<td>{log.message}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</InfiniteScroll>
	);
};

export default LogTable;
