const withOffline = require('next-offline');
const withSass = require('@zeit/next-sass');
const withTypescript = require('@zeit/next-typescript');

module.exports = withOffline(withSass(withTypescript({})));
