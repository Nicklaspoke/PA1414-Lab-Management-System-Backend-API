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
 * Changes the role of a user account
 *
 * @async
 *
 * @param {formData} formData - Conatins data for the database procedure
 */
async function changeUserStatus(formData) {
    const data = [
        formData.userId,
        formData.role != undefined ? formData.role : 3,
    ];

    const message = await dbComms.changeUserStatus(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': '200 Ok',
        };
    }
}

/**
 *  Approves the user account
 * @param {formData} formData
 */
async function approveUser(formData) {
    const data = [
        formData.userId,
        formData.role != undefined ? formData.role : 3,
    ];

    const message = await dbComms.approveUser(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': '200 Ok',
        };
    }
}

/**
 * Denies a user account, compleatly removes them from the database
 *
 * @async
 *
 * @param {string} userId
 */
async function denyUser(userId) {
    const data = [
        userId,
    ];

    const message = await dbComms.denyUserAccount(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': '200 Ok',
        };
    }
}

/**
 * Marks the user as deleted/removed in the database
 * aka a soft delete
 *
 * @param {string} userId
 */
async function removeUser(userId) {
    const data = [
        userId,
    ];

    const message = await dbComms.removeUser(data);

    if (message.includes('Error')) {
        return errors[message];
    } else {
        return {
            'status': '200 Ok',
        };
    }
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
    approveUser: approveUser,
    removeUser: removeUser,
    denyUser: denyUser,
};
