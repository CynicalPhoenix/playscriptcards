const mysql = require('mysql');
const { promisify }= require('util');


const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code == 'ERR_CON_COUNT_ERROR') {
            console.error('DATABASE WAS TOO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }

    if (conn) conn.release();
    console.log('DB is Connected');
});

// Promisify pool query
pool.query = promisify(pool.query);

module.exports = pool;