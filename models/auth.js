/**
 * Moduel/model for authenticating user logins and if they have a valid
 * JWT
 */
'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbComms = require('./dbComms.js');
const config = require('../config/config.json');

/**
 * Checks the login info for the user account with a certain Id
 *
 * @async
 *
 * @param {formData} formData -  form data with login details
 *
 * @return {JSON} - With a login responce
 */
async function login(formData) {
    const res = await dbComms.getLoginDetails(formData.schoolId);

    if (res[0] === undefined) {
        return {
            'errors': {
                'status': 401,
                'title': 'Invalid Credetials',
                'detail': 'Invalid password or school Id',
            },
        };
    }
    const hashedPwd = res[0].hashedPwd;

    if (await bcrypt.compare(formData.password, hashedPwd)) {
        return await genJWT(formData.schoolId);
    } else {
        return {
            'errors': {
                'status': 401,
                'title': 'Invalid Credetials',
                'detail': 'Invalid password or school Id',
            },
        };
    }
}

/**
 *
 * @param {string} userId - the Id of the user who wants to validate their request
 * @param {int} roleId - the roleId that is needed for a successfull validation
 */
async function validateRequest(userId, roleId) {

}

/**
 *Validates a JWT

 *
 * @param {string} token - a JWT token to validate
 *
 * @return {boolean} - if the token was validated or not
 */
async function validateToken(token) {

}

/**
 * Generates a new JWT for a user
 *
 * @async
 *
 * @param {string} userId - The id of the user to give the token to
 */
async function genJWT(userId) {
    const payload = {
        test: 'test',
    };

    const signOptions = {
        issuer: 'SERL-BTH',
        subject: userId,
        expiresIn: '12h',
        algorithm: 'HS256',
    };

    const token = await jwt.sign( payload, config.jwtSecret, signOptions);

    return token;
}
module.exports = {
    validateToken: validateToken,
    validateRequest: validateRequest,
    login: login,
};
