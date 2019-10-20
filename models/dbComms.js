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

    res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 * Gets all the userdata from the database
 */
async function getAllusers() {
    sql = `CALL get_user_data`;

    res = await db.query(sql);

    return res[0];
}

/**
 *
 * @param {list} data - list containing userId and new status
 */
async function changeUserStatus(data) {
    sql = 'CALL change_user_status(?, ?)';

    res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 *
 * @param {list} data - list conatingin data for the procedure
 */
async function approveUser(data) {
    sql = 'CALL approve_user(?, ?)';

    res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 * Makrs a user as deleted/removed in the database
 *
 * @async
 *
 * @param {list} data - containing data for the database procedure
 */
async function removeUser(data) {
    sql = 'CALL remove_user(?)';

    res = await db.query(sql, data);

    return res[0][0].message;
}
/**
 * Denies a user account and remoes them from the database
 *
 * @async
 *
 * @param {list} data - contains the userId to deny approval
 */
async function denyUserAccount(data) {
    sql = 'CALL deny_user_account(?)';

    const res = await db.query(sql, data);

    return res[0][0].message;
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

/**
 * Gets the info about all the equipment in the database
 */
async function getEquipmentData() {
    sql = `CALL get_equipment_info`;

    res = await db.query(sql);

    return res[0];
}

/**
 * Calls the procedure to insert data for new equipment into the database
 *
 * @async
 *
 * @param {list} data - contains the form data for the equipment
 */
async function addNewEquipment(data) {
    sql = 'CALL add_new_equipment(?, ?, ?)';

    res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 *  Calls the procedure for updateing a pice of equipment
 *
 * @async
 *
 * @param {list} data - contins form data for the equipment
 */
async function updateEquipment(data) {
    sql = 'CALL update_equipment(?, ?, ?)';

    const res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 * Marks a piace of equipment as deleted in the database
 *
 * @async
 *
 * @param {list} data - contains the data for the called procedure
 */
async function removeEquipment(data) {
    sql = 'CALL remove_equipment(?)';

    const res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 * Function that handles the retrival of bookings from a user
 *
 * @param {list} data - conatins the userId to get bookings from
 */
async function getBookings(data) {
    sql = 'CALL get_booked_equipment(?)';

    res = await db.query(sql, data);

    return res[0];
}

/**
 * Gets all bookings for the admin
 */
async function getAllBookings() {
    sql = 'CALL get_all_bookings';

    res = await db.query(sql);

    return res[0];
}
/**
 * Function that calls the booking procedure
 *
 * @async
 *
 * @param {list} data - contains the user_id and barcode
 */
async function bookEquipment(data) {
    sql = 'CALL book_equipment(?, ?, ?)';

    res = await db.query(sql, data);

    return (res[0][0].message);
}

/**
 *Function for calling the approve booking procedure
 *
 * @async
 *
 * @param {list} data - list with the booking id
 */
async function approveBooking(data) {
    sql = 'CALL approve_booking(?)';

    res = await db.query(sql, data);

    return (res[0][0].message);
}

/**
 *Function for calling the deny booking procedure
 *
 * @async
 *
 * @param {list} data - list that contains the booking id
 */
async function denyBooking(data) {
    sql = 'CALL deny_booking(?)';

    res = await db.query(sql, data);

    return (res[0][0].message);
}

/**
 * Calls the procedure for chekcing out booked equipment
 *
 * @async
 *
 * @param {list} data - contains data for the procedure
 */
async function checkOutEquipment(data) {
    sql = 'CALL check_out_equipment(?, ?)';

    const res = await db.query(sql, data);

    return res[0][0].message;
}

/**
 *Calls the procedure for returning equipment
 *
 * @async
 *
 * @param {list} data - contains data for the procedure
 */
async function returnEquipment(data) {
    sql = 'CALL return_equipment(?, ?)';

    const res = await db.query(sql, data);

    return res[0][0].message;
}

module.exports = {
    registerNewUser: registerNewUser,
    changeUserStatus: changeUserStatus,
    getAllusers: getAllusers,
    approveUser: approveUser,
    removeUser: removeUser,
    denyUserAccount: denyUserAccount,
    getLoginDetails: getLoginDetails,
    getEquipmentData: getEquipmentData,
    addNewEquipment: addNewEquipment,
    updateEquipment: updateEquipment,
    removeEquipment: removeEquipment,
    getBookings: getBookings,
    getAllBookings: getAllBookings,
    bookEquipment: bookEquipment,
    approveBooking: approveBooking,
    denyBooking: denyBooking,
    checkOutEquipment: checkOutEquipment,
    returnEquipment: returnEquipment,
};
