'use strict';

const { app, server } = require('./server');

const port = process.env.PORT || 3000;

app.prepare().then(() => {
	server.listen(port, err => {
		if (err) throw err;

		console.log(`Ready on http://localhost:${port}`);
	});
});
