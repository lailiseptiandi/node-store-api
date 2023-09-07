const config = require('../configs/database');
const mysql = require('mysql')
const pool = mysql.createPool(config)

pool.on('error',(err)=> {
    console.error(err);
});

module.exports = {
}