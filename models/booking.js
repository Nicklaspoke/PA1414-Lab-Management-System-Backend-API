/**
 * Module that handles booking
 *
 * @author Nicklas König (niko14)
 */
'use strict';

const dbComms = require('./dbComms.js');
const errors = require('../config/errors.json');

/**
 * Function that handles retrival of booked equipment
 * of a user
 *
 * @async
 *
 * @param {JSON} token - JWT containing user data
 */
async function getBookedEquipment(token) {
    const data = [
        token.sub,
    ];

    const res = await dbComms.getBookings(data);

    if (res.message) {
        return errors[message];
    } else {
        return res;
    }
}

/**
 * Retives all bookings in the database for the admin
 *
 * @async
 */
async function getAllBookings() {
    const res = await dbComms.getAllBookings();

    return res;
}
/**
 * Function for handling the booking of equipment
 *
 * @async
 *
 * @param {JSON} token - jwt containing the userId for the bookign
 * @param {formData} formData - data from the booking form
 */
async function bookEquipment(token, formData) {
    const data = [
        token.sub,
        formData.barcode,
    ];

    const message = await dbComms.bookEquipment(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'data': {
                'message': 'Booking succesfull, awaiting aproval form admin',
            },
        };
    }
}

/**
 * Function for handling the aproving of a booked equipment
 *
 * @async
 *
 * @param {int} bookingId - the id of the booking that is going to be approved
 */
async function approveBooking(bookingId) {
    const data = [
        bookingId,
    ];

    const message = await dbComms.approveBooking(data);

    if (message.includes('Error')) {
        return errors[message];
    }
}

/**
 * Function for handling denying of a booking
 *
 * @async
 *
 * @param {int} bookingId - the id of the booking that is going to be denied
 */
async function denyBooking(bookingId) {
    const data = [
        bookingId,
    ];

    const message = await dbComms.denyBooking(data);

    if (message.includes('Error')) {
        return errors[message];
    }
}

/**
 *
 * @param {JSON} token - JWT token containing the user data
 * @param {int} bookingId
 */
async function checkOutEquipment(token, bookingId) {
    const data = [
        bookingId,
        token.sub,
    ];

    const message = await dbComms.checkOutEquipment(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': message,
        };
    }
}

/**
 *
 * @param {JSON} token - JWT token
 * @param {*} bookingId - the booking id for the booking to return
 */
async function returnEquipment(token, bookingId) {
    const data = [
        bookingId,
        token.sub,
    ];

    const message = await dbComms.returnEquipment(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': message,
        };
    }
}

module.exports = {
    getBookedEquipment: getBookedEquipment,
    bookEquipment: bookEquipment,
    getAllBookings: getAllBookings,
    approveBooking: approveBooking,
    denyBooking: denyBooking,
    checkOutEquipment: checkOutEquipment,
    returnEquipment: returnEquipment,
};
