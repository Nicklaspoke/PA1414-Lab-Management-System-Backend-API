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
const path = require('path');
const cors = require('cors');
const corsOptions = {
    origin: '*',
};

//  Define server variable and port
const port = setup.port;
const server = express();

//  Set up and start the server
server.use(cors(corsOptions));
server.options('*', cors());
server.set('view engine', 'ejs');
server.use('/', apiRouter);
server.use(express.static(path.join(__dirname, 'public')));
server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
