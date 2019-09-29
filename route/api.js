/**
 * Route handler for the api
 *
 * @author Nicklas König (niko14)
 */

'use strict';

//  Import express, bodyparser and database call handler.
const express = require('express');

const auth = require('../models/auth.js');
const register = require('../models/register.js');
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
router.post('/register/student', urlencodedparser, async (req, res) => {
    const message = await register.registerStudent(req.body)

    res.json(message);
});

/**
 * Creates a user based on a form from the admin. Will need a key that as admin access
 *
 * @async
 *
 * @param {urlencodedparser} urlencodedparser - Object containing form data
 */
router.post('/register/user', urlencodedparser, async (req, res) => {

    //  Authenticate the user
    if (!req.header('x-access-token')) {
        res.json({
            'errors': {
                'status': 401,
                'title': 'No token',
                'details': 'No aceess token provided in header',
            },
        });
    }

    const validation = await auth.validateToken(req.header('x-access-token'));

    if (validation.errors) {
        res.json(validation);
    }

    let message;

    if (validation.admin) {
        message = await register.registerUser(req.body)
    } else {
        message = {
            'errors': {
                'status': 401,
                'title': 'Unauthorized User',
                'details': 'Only users with admins can use this route',
            },
        };
    }

    res.json(message);
});

router.post('/login', urlencodedparser, async (req, res) => {

    const message = await auth.login(req.body);

    res.json(message);
});

module.exports = router;
