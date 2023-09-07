const config = require('../config/db.config');
const mysql = require('mysql');
const { sendSuccessResponse, sendErrorResponse} = require('../helpers/helper');
const pool = mysql.createPool(config)
const Joi = require('joi');

pool.on('error',(err)=> {
    console.error(err);
});


const productRequiredField = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).required(),
    image: Joi.string().allow('').optional()
});


function getProduct(req, res){
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

function  createProduct(req, res){

    const { error } = productRequiredField.validate(req.body);
    let date = new Date();

    if (error) {
        sendErrorResponse(res, error.details[0].message);
        return;
        }
   
    let data = {
        name : req.body.name,
        description : req.body.description,
        image : req.body.image,
        price : req.body.price,
        quantity : req.body.quantity,
        created_at: date,
        updated_at: date,
    }
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

function getProductByID(req, res){
    let id = req.params.id;

    pool.getConnection(function(err, connection){
        if(err) throw err;
        let sql = `SELECT * FROM products WHERE id = ?;`
        connection.query(sql, [id], function(error, results){
            if(error) throw sendErrorResponse(error, "failed get detail product");
            
            sendSuccessResponse(res, "success get detail product", results)
        });
    });
}

function  updateProduct(req, res){
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
        let sql = `UPDATE products SET ? WHERE id = ?;`
        connection.query(sql,[data, id], function(error, results){
            if(error) throw error;
            res.send({
                success: true,
                message: 'success updated product',
            });
        });
    });
}

function deleteProduct(req, res){
    let id = req.params.id;

    pool.getConnection(function(err, connection){
        if(err)throw err;
        let sql = `DELETE FROM products WHERE id = ?;`
        connection.query(sql,[id], function(error, results){
            if(error) throw error;
            sendSuccessResponse(res, "success deleted product")
        })
    })
}

module.exports ={
    getProduct,
    createProduct,
    getProductByID,
    updateProduct,
    deleteProduct,
    
}