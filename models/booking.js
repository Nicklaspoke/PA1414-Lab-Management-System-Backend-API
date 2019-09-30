/**
 * Module that handles booking
 */
'use strict';

const dbComms = require('./dbComms.js');
const errors = require('../config/errors.json');

/**
 * Function for handling the booking of equipment
 *
 * @async
 *
 * @param {JSON} token - jwt containing the userId of the person who want's to book
 * @param {formData} formData - data from the booking form
 */
async function bookEquipment(token, formData) {
    const data = [
        token.sub,
        formData.barcode,
    ];

    const message = await dbComms.bookEquipment(data);

    switch (message) {
    case 'barcode failure':
        return errors.barcodeError;
    case 'user failure':
        return errors.invalidUser;
    case 'status failure':
        return errors.bookingError;
    case 'success':
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

}

module.exports = {
    bookEquipment: bookEquipment,
    approveBooking: approveBooking,
};
