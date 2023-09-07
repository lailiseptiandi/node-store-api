require('express-router-group');
const router = require('express').Router();
const { ProductController } = require('../controllers');

router.get('/product', ProductController.getProduct);
router.post('/product', ProductController.createProduct);
router.get('/product/:id', ProductController.getProductByID);
router.put('/product/:id', ProductController.updateProduct);
router.delete('/product/:id', ProductController.deleteProduct);

module.exports = router;