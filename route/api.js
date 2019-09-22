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
router.get('/', (req, res) => {
    const data = {
        title: 'Lab Management System | API Doc',
    };

    res.render('index', data)
});

router.get('/test', (req, res) => {
    res.json({message: 'Derpy is best pone'});
});

/**
 * Handles the creation of a new user in the system
 * @param urlencodedparser - Object containing form data.
 */
router.post('/registrer/user/student', urlencodedparser, async (req, res) => {
    const message = await apiSql.registerNewStudent(
        req.body.schoolId,
        req.body.email,
        req.body.password,
        'student'
    );
    console.log(message);
    res.json({message: message});
});

module.exports = router;
