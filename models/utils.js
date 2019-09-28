/**
 * Module for different utils for the backend souch as password generation
 *
 * @author Nicklas König (niko14)
 */

'use strict';

const bcrypt = require('bcryptjs');

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
