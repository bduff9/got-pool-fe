'use strict';

const awsServerlessExpress = require('aws-serverless-express');

const {
	app,
	server,
} = require('./server');
const binaryMimeTypes = require('./binaryMimeTypes');

exports.handler = (event, context) => {
	app.prepare().then(() => {
		return awsServerlessExpress.proxy(
			awsServerlessExpress.createServer(server, null, binaryMimeTypes),
			event,
			context,
		);
	});
};
