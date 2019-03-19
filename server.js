'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const next = require('next');
const {
	join
} = require('path');
const {
	parse
} = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({
	dev,
});
const handle = app.getRequestHandler();

const createServer = () => {
	const server = express();

	server.use(cookieParser());
	server.get('/service-worker.js', (req, res) => {
		const parsedUrl = parse(req.url, true);
		const {
			pathname
		} = parsedUrl;
		const filePath = join(__dirname, '.next', pathname);

		app.serveStatic(req, res, filePath);
	});
	server.get('/dogs/:breed', (req, res) => app.render(req, res, '/dogs/_breed', {
		breed: req.params.breed,
	}));
	server.get('*', (req, res) => handle(req, res));

	return server;
};

const server = createServer();

module.exports = {
	app,
	server,
};
