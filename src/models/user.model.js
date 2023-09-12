const config = require('../config/db.config');
const mysql = require('mysql');
const pool = mysql.createPool(config.dbConfig);
const { sendSuccessResponse, sendErrorResponse} = require('../helpers/helper');

pool.on('error',(err)=> {
    console.error(err);
});


function createUser(res, data, callback){
    pool.getConnection(function(err, connection){
       connection.release();
        if(err) {
            return sendErrorResponse(res, err.message)
        }
        let sql = "INSERT INTO users SET ?;";

        connection.query(sql, [data], function(err, results){
             if(err){
            connection.release();
               return  sendErrorResponse(res, err.sqlMessage)
             }
              const userId = results.insertId;
             // Query the user from the database using the inserted ID
              const getUserSql = 'SELECT * FROM users WHERE id = ?';
                connection.query(getUserSql, [userId], function(err, userResults) {
                if (err) {
                    return sendErrorResponse(res, 'Database query error', err);
                }

                if (userResults.length > 0) {
                    const user = userResults[0];
                   return callback(null, userResults[0]);
                } else {
                    return sendErrorResponse(res, 'User not found after insert', null);
                }
            });
        });
     
    });
}
function findUserByEmail(email, callback){
   pool.getConnection(function(err, connection) {
    if (err) {
      return callback(err, null);
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], function(err, results) {
      connection.release();

      if (err) {
        return callback(err, null);
      }

      if (results.length > 0) {
        // User with the given email exists
        return callback(null, results[0]);
      } else {
        // User with the given email does not exist
        return callback(null, null);
      }
    });
  });
}

module.exports = {
    createUser,
    findUserByEmail,
}