/**
 * Route handler for the api
 *
 * @author Nicklas König (niko14)
 */

'use strict';

//  Import express, bodyparser and database call handler.
const express = require('express');
const apiSql = require('../src/apiSql.js');
const bodyparser = require('body-parser');

//  Define router and urlencodedparser
const router = express.Router();
const urlencodedparser = bodyparser.urlencoded({extended: false});

//  Handle the different routes
router.get('/test', (req, res) => {
    res.json({message: 'Derpy is best pone'});
});

module.exports = router;
