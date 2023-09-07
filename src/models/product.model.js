const config = require('../config/db.config');
const mysql = require('mysql')
const pool = mysql.createPool(config)

pool.on('error',(err)=> {
    console.error(err);
});

module.exports = {
    // GetProduct()
}