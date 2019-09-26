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
    const res = await dbComms.getLoginDetails(formData.userId);

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
    const roleId = res[0].role;

    if (await bcrypt.compare(formData.password, hashedPwd)) {
        const token = await genJWT(formData.userId, roleId);
        validateToken(token);
        return {
            'data': {
                'type': 'success',
                'message': 'User logged in',
                'user': {
                    'userId': userId,
                },
                'token': token,
            }
        }
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
    const verifyOptions = {
        issuer: 'SERL-BTH',
    };

    const verification = await jwt.verify(token, config.jwtSecret, verifyOptions);

    console.log(verification.admin);
}

/**
 * Generates a new JWT for a user
 *
 * @async
 *
 * @param {string} userId - The id of the user to give the token to
 * @param {int} roleId - The Id of the role the user has
 */
async function genJWT(userId, roleId) {
    const payload = {
        admin: roleId === 1 ? true : false,
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
