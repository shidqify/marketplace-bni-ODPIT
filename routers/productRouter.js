const router = require('express').Router();
const Product = require('../controllers/productController');
const { permit, auth } = require('../middlewares/userAuth');

router.post('/', auth, permit('admin'), Product.addProduct);

module.exports = router;