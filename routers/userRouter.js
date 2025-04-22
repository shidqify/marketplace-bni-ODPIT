const router = require('express').Router();
const User = require('../controllers/userController');
const { auth, permit } = require('../middlewares/userAuth');

router.post('/register', User.register);
router.post('/login', User.login);
router.get('/', auth, permit('admin'), User.getAll);

module.exports = router;