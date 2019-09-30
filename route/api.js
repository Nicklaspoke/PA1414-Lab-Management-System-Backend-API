/**
 * Route handler for the api
 *
 * @author Nicklas König (niko14)
 */

'use strict';

//  Import express, bodyparser and database call handler.
const express = require('express');
const bodyparser = require('body-parser');

const auth = require('../models/auth.js');
const register = require('../models/register.js');
const equipment = require('../models/equipment.js');
const booking = require('../models/booking.js');

const errors = require('../config/errors.json');

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
    const message = await register.registerStudent(req.body);

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

    const token = await auth.validateHeader(req.headers);

    if (validation.errors) {
        res.json(validation);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else {
        res.json(await register.registerUser(req.body));
    }
});

router.post('/login', urlencodedparser, async (req, res) => {

    const message = await auth.login(req.body);

    res.json(message);
});

//  Routes for equipment

//  Gets the equipment from the database with the its info,
//  such as barcode, name and status
router.get('/equipment', async (req, res) => {
    const data = await equipment.getEquipmentData();

    res.json({
        'data': data,
    });
});

//  Route for adding new equipment into the database
router.post('/equipment', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(errors);
        return;
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else {
        res.json(await equipment.addNewEquipment(req.body));
    }
});

router.put('/equipment', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(errors);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else {
        res.json(await equipment.updateEquipment(req.body));
    }
});

//  Routes for booking equipment
router.post('/book', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(errors);
    } else {
        res.json(await booking.bookEquipment(token, req.body));
    }
});

module.exports = router;
