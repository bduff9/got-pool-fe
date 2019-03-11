import gql from "graphql-tag";

export const writeLog = gql`
	mutation writeLog($action: LogActionEnum) {
		logAction(action: $action) {
			id
		}
	}
`;
