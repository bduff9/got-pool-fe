'use strict';

const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const createServer = () => {
	const server = express();

	server.get('/dogs/:breed', (req, res) => app.render(req, res, '/dogs/_breed', { breed: req.params.breed }));
  server.get("*", (req, res) => handle(req, res));

	return server;
};

const server = createServer();

module.exports = { app, server };
