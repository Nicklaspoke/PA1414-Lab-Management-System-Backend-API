/**
 * Module that handles the communication with the database
 *
 * @auther Nicklas König (niko14)
 */

//  Import required packages for the api
const mysql = require('promise-mysql');
const dbConfig = require('../config/db/login.json');
const hat = require('hat');
const bcrypt = require('bcryptjs');

let db;
let sql;
let res;
const rack = hat.rack();

/**
 * Main function to make the connection to the database
 *
 * @async
 * @return {void}
 */
(async function() {
    db = await mysql.createConnection(dbConfig);

    process.on('exit', () => {
        db.end();
    });
})();

/**
 * Register a new user to the database
 *
 * @param {urlencodedparser} formData - Object containing form data
 *
 * @return {JSON} - With a responce about the account creation
 *
 */
async function registerNewStudent(formData) {
    //  Create unique api-key
    const apiKey = rack();

    pwd = await genPassword(password);

    //  Send the data to the database for storing
    sql = `CALL register_new_user(?, ?, ?, ?, ?, ?)`;
    res = await db.query(sql,
        [
            formData.schoolId,
            formData.email,
            4,
            pwd.hash,
            pwd.salt,
            apiKey,
        ]
    );

    if (res.length != undefined) {
        for (const row of res[0]) {
            return {
                'data': {
                    'message': row.message,
                }
            };
        }
    }
}

/**
 * Admin version of regsterNewStudent
 * Admin can define wich role a person will get.
 * Will need verification against the database so the sender has the right
 * access rights
 *
 * @async
 *
 * @param {urlencodedparser} form - Object containing form data
 *
 * @return {JSON} - with message about account creation
 */
async function registerNewUser(form) {
    const confromation = await validateRequest(form.userId, form.userKey, 1);

    if (!confromation) {
        return {
            'data': {
                'type': 'failure',
                'message': 'You don\'t have the proivileges to perform this task',
            },
        };
    }

    const apiKey = rack();

    pwd = await genPassword(form.password);

    sql = `CALL register_new_user(?, ?, ?, ?, ?, ?)`;

    res = await db.query(sql,
        [
            form.schoolId,
            form.email,
            form.role,
            pwd.hash,
            pwd.salt,
            apiKey,
        ]
    );

    if (res.length != undefined) {
        for (const row of res[0]) {
            return {
                'data': {
                    'message': row.message,
                },
            };
        }
    }

    return {
        'data': {
            'type': 'success',
            'message': 'Account created successfully',
        },
    };
}

/**
 * Checks the login info for the user account with a certain Id
 *
 * @async
 *
 * @param {string} schoolId
 * @param {string} password
 *
 * @return {JSON} - With a login responce
 */
async function login(schoolId, password) {
    let hashedPwd = '';
    let apiKey = '';
    let currentRole = '';

    sql = 'CALL get_login_info(?)';

    res = await db.query(sql, [schoolId]);

    if (res[0].length === 0) {
        return {message: 'Invalid password or school Id'};
    }

    //  Extract the json data
    for (const row of res[0]) {
        hashedPwd = row.hashedPwd;
        apiKey = row.apiKey;
        currentRole = row.role;
    }
    //  Compare passwords
    if (await bcrypt.compare(password, hashedPwd)) {
        return {
            apiKey: apiKey,
            currentRole: currentRole,
        };
    } else {
        return {message: 'Invalid password or school Id'};
    }
}

//  Functions not included in the export

/**
 *Generates a new password and salt for a user
 *
 * @async
 *
 * @param {string} password - the users choosen password
 *
 * @return {JSON} - With the hashed password and the salt
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
 * Validates a users request against the database
 *
 * @param {string} userId - the user id of the user to validate
 * @param {string} key - the apiKey for the user you want to validate
 * @param {int} role - The role the user needs to get their request validated
 *
 * @return {boolean} - With the responce if the validation is ok
 */
async function validateRequest(userId, key, role) {
    let validationInfo;

    sql = 'CALL get_validation_info(?)';

    res = await db.query(sql, userId);

    for (const row of res [0]) {
        validationInfo = {
            key: row.key,
            role: row.role,
        };
    }

    if (key === validationInfo.key && role === validationInfo.role) {
        return true;
    }
    return false;
}

module.exports = {
    login: login,
    registerNewStudent: registerNewStudent,
    registerNewUser: registerNewUser,
};
