const config = require('../config/db.config');
const mysql = require('mysql');
const pool = mysql.createPool(config.dbConfig);
const { sendSuccessResponse, sendErrorResponse} = require('../helpers/helper');

pool.on('error',(err)=> {
    console.error(err);
});

function getProduct(res){
    pool.getConnection(function(err, connection) {
    if(err) throw err;
    let sql = `SELECT * FROM products;`
    connection.query(sql, function(error, results){
        if(error) throw error;
        sendSuccessResponse(res, 'success get data product', results);
    });
    connection.release();
});
}

function createProduct(res, data){
   pool.getConnection(function(err, connection) {
        if(err) throw err;
        let sql = `INSERT INTO products SET ?;`
        connection.query(sql,[data], function(error, results){
            if(error) throw sendErrorResponse(res, error);
            sendSuccessResponse(res, 'success created product', null);
        });
        connection.release();
    })
}

function getProductByID(res, id){
     pool.getConnection(function(err, connection){
        if(err) throw err;
        let sql = `SELECT * FROM products WHERE id = ?;`
        connection.query(sql, [id], function(error, results){
            if(error) throw sendErrorResponse(error, "failed get detail product");
            
            sendSuccessResponse(res, "success get detail product", results)
        });
    });
}

function updateProduct(res, data, id){
    pool.getConnection(function(err, connection){
    if(err) throw err;
    let sql = `UPDATE products SET ? WHERE id = ?;`
        connection.query(sql,[data, id], function(error, results){
            if(error) throw sendErrorResponse(error, "failed updated product");
            sendSuccessResponse(res, "success updated product", results)
        });
    });
}
function deleteProduct(res, id){
     pool.getConnection(function(err, connection){
        if(err)throw err;
        let sql = `DELETE FROM products WHERE id = ?;`
        connection.query(sql,[id], function(error, results){
            if(error) throw sendErrorResponse(error, "failed deleted product");
            sendSuccessResponse(res, "success deleted product")
        })
    })
}

module.exports = {
    getProduct,
    createProduct,
    getProductByID,
    updateProduct,
    deleteProduct,

}