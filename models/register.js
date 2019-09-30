/**
 * Module for handling the different registration tasks
 * souch as user and equipment registartion to the database
 *
 * @auth Nicklas König (niko14)
 */
'use strict';

const dbComms = require('./dbComms.js');
const utils = require('./utils.js')

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

    console.log(message);
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

    return message;
}

module.exports = {
    registerStudent: registerStudent,
    registerUser: registerUser,
};
