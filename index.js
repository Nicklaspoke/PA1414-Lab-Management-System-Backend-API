/**
 * Express server for the
 * Lab Management System API in PA1414
 *
 * @author Nicklas König (niko14)
 */
'use strict';
//  Import express, router, middleware for logging and setup settings
const express = require('express');
const setup = require('./config/setup.json');
const apiRouter = require('./route/api.js');

//  Define server variable and port
const port = setup.port;
const server = express();

//  Set up router, middleware and start the server
server.use('/', apiRouter);
server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
