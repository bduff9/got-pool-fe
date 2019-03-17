import Amplify from 'aws-amplify';

Amplify.configure({
	Auth: {
		authenticationFlowType: 'USER_PASSWORD_AUTH',
		mandatorySignIn: true,
		region: 'us-east-2',
		userPoolId: 'us-east-2_m1v30jxwx',
		userPoolWebClientId: '49uh0c1mcjkf5u18t70pao0o0s',
	},
});
