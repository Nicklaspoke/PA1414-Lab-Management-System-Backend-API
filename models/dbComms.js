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
 * @param {list} data - list with all the info
 *
 * @return {JSON} - With a responce about the account creation
 *
 */
async function registerNewUser(data) {
    //  Send the data to the database for storing
    sql = `CALL register_new_user(?, ?, ?, ?, ?)`;
    console.log(data);
    res = await db.query(sql, data);

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
    registerNewUser: registerNewUser,
    getLoginDetails: getLoginDetails,
}
