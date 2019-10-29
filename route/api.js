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
// const urlencodedparser = bodyparser.urlencoded({extended: true});
router.use(bodyparser.json()); // support json encoded bodies
router.use(bodyparser.urlencoded({extended: true})); // support encoded bodies
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
router.post('/register/student', async (req, res) => {
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
 * Will need a key that has admin access
 *
 * @async
 *
 * @param {urlencodedparser} urlencodedparser - Object containing form data
 */
router.post('/register/user', async (req, res) => {
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

router.put('/register/edit', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userStatusChange');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.changeUserStatus(req.body));
    }
});

/**
 * Gets all user account info
 * Needs Admin rights
 */
router.get('/register/user', async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else {
        res.json(await register.getAllUsers());
    }
});

//  Route for admin to approve a registered teacher/student account
router.put('/register/approve', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userApprove');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.approveUser(req.body));
    }
});

//  Route for admin to approve a registered teacher/student account
router.delete('/register/deny', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userApprove');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.denyUser(req.body.userId));
    }
});

router.delete('/register', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'userApprove');

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await register.removeUser(req.body.userId));
    }
});

router.post('/login', async (req, res) => {
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
router.post('/equipment', async (req, res) => {
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

router.put('/equipment', async (req, res) => {
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

router.delete('/equipment', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'equipmentRemoval');

    if (token.errors) {
        res.json(token.errors);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUser);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await equipment.removeEquipment(req.body));
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
    } else if (!token.admin) {
        res.json(errors.unauthorizedUserError);
    } else {
        res.json(await booking.getAllBookings());
    }
});

//  Creates a booking for a user
router.post('/booking', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'bookingReg');

    if (token.errors) {
        res.json(token);
    } else if (validation.errors) {
        res.json(validation.errors);
    } else {
        res.json(await booking.bookEquipment(token, req.body));
    }
});

//  Approves booking for a user
router.put('/booking/approve', async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUserError);
    } else {
        res.json(await booking.approveBooking(req.body.bookingId, 2));
    }
});

//  Denies a booking for a user
router.put('/booking/deny', async (req, res) => {
    const token = await auth.validateHeader(req.headers);

    if (token.errors) {
        res.json(token.errors);
    } else if (!token.admin) {
        res.json(errors.unauthorizedUserError);
    } else {
        res.json(await booking.denyBooking(req.body.bookingId));
    }
});

router.put('/booking/checkout', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'booking');

    if (token.errors) {
        res.json(token.errors);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await booking.checkOutEquipment(token, req.body.barcode));
    }
});

router.put('/booking/return', async (req, res) => {
    const token = await auth.validateHeader(req.headers);
    const validation = utils.validateFormData(req.body, 'booking');

    if (token.errors) {
        res.json(token.errors);
    } else if (validation.errors) {
        res.json(validation);
    } else {
        res.json(await booking.returnEquipment(token, req.body.barcode));
    }
});
module.exports = router;
