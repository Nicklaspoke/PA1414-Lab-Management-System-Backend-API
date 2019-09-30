/**
 * Module for handling all the different tasks with equipment
 */
'use strict';

const dbComms = require('./dbComms.js');

/**
 * Gets the equipment data and converts status int into a string for the humans
 *
 * @async
 */
async function getEquipmentData() {
    let data = await dbComms.getEquipmentData();

    for (const row of data) {
        switch (row.status) {
        case 1:
            row.status = 'Available';
            break;

        case 2:
            row.status = 'Avaiting Aproval';
            break;

        case 3:
            row.status = 'Booked';
            break;
        case 4:
            row.status = 'Checked Out';
            break;
        case 5:
            row.status = 'Not available';
            break;
        }
    }

    return data;
}

/**
 * Takes the data from the form and adds the equipment into the database
 *
 * @async

 * @param {formData} formData - data from the form for adding new equipment
 */
async function addNewEquipment(formData) {
    const data = [
        formData.barcode,
        formData.name,
        formData.borrowTime,
    ];

    const message = await dbComms.addNewEquipment(data);

    return {
        'data': message,
    };
}

/**
 * Takes data from the form and updates the selected equipment
 *
 * @async
 *
 * @param {formData} formData - data from the form for editing equipment
 *
 */
async function updateEquipment(formData) {
    const data = [
        formData.barcode,
        formData.name,
        formData.borrowTime,
    ];

    const message = await dbComms.updateEquipment(data);

    return {
        'data': message,
    };
}

module.exports = {
    getEquipmentData: getEquipmentData,
    addNewEquipment: addNewEquipment,
    updateEquipment: updateEquipment,
};
