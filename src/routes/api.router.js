require('express-router-group');
const express = require('express').Router();
const { ProductController, AuthController } = require('../controllers');
const authMiddleware = require("../middleware/auth")

const router = express;
// user
router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.login)

// product
const productRouter = express;
productRouter.use(authMiddleware)
productRouter.get('/product', ProductController.getProduct);
productRouter.post('/product', ProductController.createProduct);
productRouter.get('/product/:id', ProductController.getProductByID);
productRouter.put('/product/:id', ProductController.updateProduct);
productRouter.delete('/product/:id', ProductController.deleteProduct);



module.exports = router;