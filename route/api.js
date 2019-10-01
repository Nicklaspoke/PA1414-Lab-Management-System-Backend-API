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
const utils = require('../models/utils.js');
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
    const validation = utils.validateFormData(req.body, 'userRegistration');

    if (validation.errors) {
        res.json(validation);
    } else {
        const message = await register.registerStudent(req.body);

        res.json(message);
    }
});

/**
 * Creates a user based on a form from the admin.
 * Will need a key that as admin access
 *
 * @async
 *
 * @param {urlencodedparser} urlencodedparser - Object containing form data
 */
router.post('/register/user', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userRegistration');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.registerUser(req.body));
    }
});

//  Route for admin to approve a registered teacher/student account
router.put('/register/approve', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userApprove');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.changeUserStatus(req.body, 3));
    }
});

//  Route for admin to approve a registered teacher/student account
router.put('/register/deny', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userApprove');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.changeUserStatus(req.body, 5));
    }
});
router.post('/login', urlencodedparser, async (req, res) => {
    const validation = utils.validateFormData(req.body, 'login');

    if (validation.errors) {
        res.json(validation);
    } else {
        const message = await auth.login(req.body);

        res.json(message);
    }
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
    const validation = utils.validateFormData(req.body, 'equipmentRegistraion');

    if (token.errors) {
        res.json(token.errors);
        return;
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await equipment.addNewEquipment(req.body));
    }
});

router.put('/equipment', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'equipmentRegistraion');

    if (token.errors) {
        res.json(token.errors);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await equipment.updateEquipment(req.body));
    }
});

//  Routes for booking equipment

//  Gets the bookings for a user
router.get('/booking', async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token);
    } else {
        res.json(await booking.getBookedEquipment(token));
    }
});

//  Gets all bookings for the admin
router.get('/booking/all', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    if (token.errors) {
        res.json(token);
    } else {
        res.json(await booking.getAllBookings());
    }
});

//  Creates a booking for a user
router.post('/booking', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token);
    } else {
        res.json(await booking.bookEquipment(token, req.body));
    }
});

//  Approves booking for a user
router.put('/booking/approve', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    console.log(req.headers);
    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUserError);
    } else {
        res.json(await booking.approveBooking(req.body.bookingId));
    }
});

//  Denies a booking for a user
router.put('/booking/deny', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token.errors);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUserError);
    } else {
        res.json(await booking.denyBooking(req.body.bookingId));
    }
});

router.put('/booking/checkout', urlencodedparser, async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token.errors);
    } else {
        res.json(await booking.checkOutEquipment(token, req.body));
    }
});
module.exports = router;
