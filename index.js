/**
 * Express server for the
 * Lab Management System API in PA1414
 *
 * @author Nicklas König (niko14)
 */
'use strict';
//  Import express, router, middleware for logging and setup settings
const express = require('express');
const setup = require('./config/config.json');
const apiRouter = require('./route/api.js');

//  Define server variable and port
const port = setup.port;
const server = express();

//  Set up and start the server
server.set('view engine', 'ejs');
server.use('/', apiRouter);
server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
