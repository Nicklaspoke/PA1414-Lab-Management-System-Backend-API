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
// eslint-disable-next-line new-cap
const router = express.Router();
const urlencodedparser = bodyparser.urlencoded({extended: false});

//  Handle the different routes
router.get('/', (req, res) => {
    const data = {
        title: 'Lab Management System | API Doc',
    };

    res.render('index', data);
});

/**
 * Debug, removme before release
 */
router.get('/test', (req, res) => {
    res.json({message: 'Derpy is best pone'});
});

/**
 * Handles the creation of a new student in the system
 * @param [urlencodedparser] - Object containing form data.
 */
router.post('/registrer/student', urlencodedparser, async (req, res) => {
    const message = await apiSql.registerNewStudent(req.body);

    res.json(message);
});

/**
 * Creates a user based on a form from the admin. Will need a key that as admin access
 *
 * @async
 *
 * @param {urlencodedparser} urlencodedparser - Object containing form data
 */
router.post('/registrer/user', urlencodedparser, async (req, res) => {
    const message = await apiSql.registerNewUser(req.body);

    res.json(message);
});

router.post('/login', urlencodedparser, async (req, res) => {
    const data = await apiSql.login(
        req.body.schoolId,
        req.body.password
    );

    res.json(data);
});

module.exports = router;
