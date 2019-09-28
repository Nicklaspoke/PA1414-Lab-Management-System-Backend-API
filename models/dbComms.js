/**
 * Module for handling all the communication with the database
 * So multiple moduls need to make connnections
 *
 * @author Nicklas König (niko14)
 */
'use strict';

const mysql = require('promise-mysql');
const dbconfig = require('../config/db/login.json');

let db;
let sql;
let res;

/**
 * Main function that keeps the db connection alive
 *
 * @async
 * @return {void}
 */
(async function() {
    db = await mysql.createConnection(dbconfig);

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
 *Form from admin interface where a user is created
 *
 * @async
 *
 * @param {formData} formData - Data from the registrationform
 */
async function registerNewUser(formData) {
    sql = `CALL register_new_user(?, ?, ?, ?, ?, ?)`;

    res = await db.query(sql,
        [
            formData.schoolId,
            formData.email,
            formData.role,
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
}

/**
 * Gets the hashed password for the user that want's to login
 *
 * @async
 *
 * @param {string} userId - the userId of the user that want's to login
 */
async function getLoginDetails(userId) {
    sql = `CALL get_login_info(?)`;

    res = await db.query(sql, [userId]);

    return res[0];
}
module.exports = {
    registerNewStudent: registerNewStudent,
    registerNewUser: registerNewUser,
    getLoginDetails: getLoginDetails,
}
