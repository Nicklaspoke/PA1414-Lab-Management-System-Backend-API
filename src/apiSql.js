/**
 * Module that handles the communication with the database
 *
 * @auther Nicklas König (niko14)
 */

//  Import required packages for the api
const mysql = require('promise-mysql');
const dbConfig = require('../config/db/login.json');
const hat = require('hat');
const bcrypt = require('bcrypt');

let db;
let sql;
let res;
let rack = hat.rack();

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
}) ();

/**
 * Register a new user to the database
 *
 * @param {string}  schoolId        - The users BTH school Akronym/id.
 * @param {string}  email           - The users email address.
 * @param {string}  password        - The users selected password.
 * @param {string} [role=student]   - The assigned role for the user.
 */
async function registerNewStudent(schoolId, email, password, role='student') {
    const saltRounds = 10;
    //  Create salt and unique api-key
    const apiKey = rack();
    const salt = await bcrypt.genSalt(saltRounds);

    console.log('School Id:', schoolId);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('Salt:', salt);
    console.log('Api-key:', apiKey);


    //  Hash the password
    const hash = await bcrypt.hash(password, salt);

    console.log('Hash:', hash);
    //  Get the role id
    let roleId = 0;

    if (role === 'admin') {
        roleId = 1;
    } else if (role === 'teacher') {
        roleId = 2;
    } else {
        roleId = 4;
    }

    //  Send the data to the database for storing
    sql = `CALL register_new_user(?, ?, ?, ?, ?, ?)`;
    res = await db.query(sql, [schoolId, email, roleId, hash, salt, apiKey]);

    if (res.length != undefined) {
        for (const row of res[0]) {
            return row.message;
        }
    }
}

module.exports = {
    registerNewStudent: registerNewStudent,
};
