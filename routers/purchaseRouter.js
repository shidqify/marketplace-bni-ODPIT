const router = require('express').Router();
const Purchase = require('../controllers/purchaseController');
const { auth, permit } = require('../middlewares/userAuth');

router.post('/', auth, Purchase.buy);

module.exports = router;