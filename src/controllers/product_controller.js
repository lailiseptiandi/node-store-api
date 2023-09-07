const config = require('../configs/database');
const mysql = require('mysql')
const pool = mysql.createPool(config)

pool.on('error',(err)=> {
    console.error(err);
});
module.exports ={
    // get data product
    getProduct(req, res){
        pool.getConnection(function(err, connection) {
            if(err) throw err;
            let sql = `SELECT * FROM products;`
            connection.query(sql, function(error, results){
                if(error) throw error;
                res.send({
                    success: true,
                    message: 'success get data product',
                    data: results
                });
            });
           connection.release();
        })
    },

    createProduct(req, res){
        let data = {
            name : req.body.name,
            description : req.body.description,
            image : req.body.image,
            price : req.body.price,
            quantity : req.body.quantity,
        }
        pool.getConnection(function(err, connection) {
            if(err) throw err;
            let sql = `INSERT INTO products SET ?;`
            connection.query(sql,[data], function(error, results){
                if(error) throw error;
                res.send({
                    success: true,
                    message: 'success created product',
                    data: results
                });
            });
           connection.release();
        })
    },

    getProductByID(req, res){
        let id = req.params.id;

        pool.getConnection(function(err, connection){
            if(err) throw err;
            let sql = `SELECT * FROM products WHERE id_product = ?;`
            connection.query(sql, [id], function(error, results){
                if(error) throw error;
                res.send({
                    success: true,
                    message: 'success get detail product',
                    data: results
                });
            });
        });
    },

    updateProduct(req, res){
         let id = req.body.id;
         let data = {
            name : req.body.name,
            description : req.body.description,
            image : req.body.image,
            price : req.body.price,
            quantity : req.body.quantity,

         }

        pool.getConnection(function(err, connection){
            if(err) throw err;
            let sql = `UPDATE products SET ? WHERE id_product = ?;`
            connection.query(sql,[data, id], function(error, results){
                if(error) throw error;
                res.send({
                    success: true,
                    message: 'success updated product',
                });
            });
        });
    },

    deleteProduct(req, res){
        let id = req.params.id;

        pool.getConnection(function(err, connection){
            if(err)throw err;
            let sql = `DELETE FROM products WHERE id_product = ?;`
            connection.query(sql,[id], function(error, results){
                if(error) throw error;
                res.send({
                    success: true,
                    message: 'success deleted product',
                });
            })
        })
    }
    
}