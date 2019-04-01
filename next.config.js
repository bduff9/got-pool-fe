//const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withTypescript = require('@zeit/next-typescript');
let config = {
	assetPrefix: 'https://got-pool-static-resources.s3.amazonaws.com',
	target: 'serverless',
};

if (process.env.NODE_ENV === 'local') {
	config = {};
}

module.exports = //withOffline(
	withSass(
		withTypescript(
			config,
		)
	);
//);
