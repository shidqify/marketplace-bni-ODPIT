const router = require('express').Router();
const userRouter = require('./userRouter');
const purchaseRouter = require('./purchaseRouter');
const productRouter = require('./productRouter');

router.use('/user', userRouter);
router.use('/purchase', purchaseRouter);
router.use('/product', productRouter);

module.exports = router;