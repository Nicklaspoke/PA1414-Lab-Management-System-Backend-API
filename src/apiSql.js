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
 * @param {string}  schoolId        - The users BTH school Akronym/id.
 * @param {string}  email           - The users email address.
 * @param {string}  password        - The users selected password.
 *
 */
async function registerNewStudent(schoolId, email, password) {
    const saltRounds = 10;
    //  Create salt and unique api-key
    const apiKey = rack();
    const salt = await bcrypt.genSalt(saltRounds);


    //  Hash the password
    const hash = await bcrypt.hash(password, salt);

    //  Set the role id
    const role = 4;

    //  Send the data to the database for storing
    sql = `CALL register_new_user(?, ?, ?, ?, ?, ?)`;
    res = await db.query(sql, [schoolId, email, role, hash, salt, apiKey]);

    if (res.length != undefined) {
        for (const row of res[0]) {
            return row.message;
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
 * @param {urlencodedparser} formData - Object containing form data
 */
async function registerNewUser(formData) {

}

/**
 * Checks the login info for the user account with a certain Id
 *
 * @async
 *
 * @param {string} schoolId
 * @param {string} password
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

module.exports = {
    registerNewStudent: registerNewStudent,
    login: login,
};
