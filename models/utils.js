/**
 * Module for different utils for the backend souch as password generation
 *
 * @author Nicklas König (niko14)
 */

'use strict';

const bcrypt = require('bcryptjs');

const errors = require('../config/errors.json');
const formValidation = require('../config/formValidation.json');

/**
 * Generate a new password for the user
 *
 * @async
 *
 * @param {string} password - Plaintext password from the registration form
 *
 * @return {JSON} - With the pasword and salt
 */
async function genPassword(password) {
    const saltRounds = 10;

    //  Generate the salt
    const salt = await bcrypt.genSalt(saltRounds);

    //  Hash the password
    const hash = await bcrypt.hash(password, salt);

    return {
        hash: hash,
        salt: salt,
    };
}

/**
 * Validates the data in the form so all values are present
 *
 * @param {formData} formData - the data to validate
 * @param {string} type - which type of form to register
 *
 * @return {JSON}
 */
function validateFormData(formData, type) {
    for (const field of formValidation[type]) {
        if (field in formData === false) {
            return errors.invalidFormError;
        }
    }
    return {'Ok': 'Ok'};
}

module.exports = {
    genPassword: genPassword,
    validateFormData: validateFormData,
};
