/**
 * Module for handling the different registration tasks
 * souch as user and equipment registartion to the database
 *
 * @auth Nicklas König (niko14)
 */
'use strict';

const dbComms = require('./dbComms.js');
const utils = require('./utils.js');
const errors = require('../config/errors.json');

/**
 * Takes the formdata and parses it to a list that is sent
 * to the dbComms module for insertion in the database
 * @async
 *
 * @param {forData} formData - Data from the registration form for students
 *
 * @return {string}
 */
async function registerStudent(formData) {
    //  Encrypt the password for the user
    const pwd = await utils.genPassword(formData.password);

    const data = [
        formData.userId,
        formData.email,
        4,
        pwd.hash,
        pwd.salt,
    ];

    const message = await dbComms.registerNewUser(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'data': message,
        };
    }
}

/**
 * Approves the registration of a user account
 *
 * @param {string} userId - the id of the user to aprove
 */
async function changeUserStatus(userId, newStatus) {

}

/**
 *
 * @param {formData} formData - Data from the registration form for admins
 */
async function registerUser(formData) {
    //  Encrypt the users password
    const pwd = await utils.genPassword(formData.password);

    const data = [
        formData.userId,
        formData.email,
        formData.role,
        pwd.hash,
        pwd.salt,
    ];

    const message = await dbComms.registerNewUser(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'data': message,
        };
    }
}

module.exports = {
    registerStudent: registerStudent,
    registerUser: registerUser,
    changeUserStatus: changeUserStatus,
};
