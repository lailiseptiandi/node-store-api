const validator = require('joi');
const model = require('../models')


const productRequiredField = validator.object({
    name: validator.string().required(),
    description: validator.string().required(),
    price: validator.number().min(0).required(),
    quantity: validator.number().min(0).required(),
    image: validator.string().allow('').optional()
});


function getProduct(req, res){
    model.productModel.getProduct(res)
}

function createProduct(req, res){

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
    model.productModel.createProduct(res,data)
}

function getProductByID(req, res){
    let id = req.params.id;

    model.productModel.getProductByID(res, id)
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

    model.productModel.updateProduct(res, data)
}

function deleteProduct(req, res){
    let id = req.params.id;
    model.productModel.deleteProduct(res, id)
}

module.exports ={
    getProduct,
    createProduct,
    getProductByID,
    updateProduct,
    deleteProduct,
    
}