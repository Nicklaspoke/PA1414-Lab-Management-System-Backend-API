/**
 * Moduel/model for authenticating user logins and if they have a valid
 * JWT
 */
'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbComms = require('./dbComms.js');
const config = require('../config/config.json');
const errors = require('../config/errors.json');

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
        return errors.invalidLoginError;
    } else if (res[0].message) {
        return errors[res[0].message];
    }
    const hashedPwd = res[0].hashedPwd;
    const roleId = res[0].role;

    if (await bcrypt.compare(formData.password, hashedPwd)) {
        if (roleId === 4) {
            return errors.accountNotApprovedError;
        }

        const token = await genJWT(formData.userId, roleId);

        return {
            'data': {
                'type': 'success',
                'message': 'User logged in',
                'user': {
                    'userId': formData.userId,
                },
                'token': token,
            },
        };
    } else {
        return errors.invalidLoginError;
    }
}

/**
 * Validates that the recived header contains a access token
 * And validates the token
 *
 * @param {req.headers} headers - Headers from the requester
 *
 * @return {JSON}
 */
async function validateHeader(headers) {
    //  Authenticate the user
    if (!headers['x-access-token']) {
        return errors.noTokenError;
    }

    const validation = await validateToken(headers['x-access-token']);

    return validation;
}

/**
 *Validates a JWT
 * @async
 *
 * @param {string} token - a JWT token to validate
 *
 *
 */
async function validateToken(token) {
    const verifyOptions = {
        issuer: 'SERL-BTH',
        algorithm: 'HS256',
    };

    let decodedToken;
    let error;
    jwt.verify(token,
        config.jwtSecret,
        verifyOptions,
        function(err, decoded) {
            if (err) {
                error = {
                    'errors': {
                        'status': 401,
                        'title': err.name,
                        'detail': err.message,
                    },
                };
            };

            decodedToken = decoded;
        });

    if (error) {
        return error;
    }

    return decodedToken;
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
    validateHeader: validateHeader,
    login: login,
};
