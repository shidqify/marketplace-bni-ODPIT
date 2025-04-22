const logger = require("../middlewares/utils/logger");
const { Purchase, User, Product } = require('../models');

class PurchaseController {
  static async buy(req, res, next) {
    try {
      const productId = req.body.productId;

      if (!productId) {
        throw { status: 400, message: 'productId wajib diisi' }
      }
  
      const userData = req.user.id;

      const product = await Product.findByPk(Number(productId));

      if (!product) throw { status: 404, message: 'Product not found' }
  
      const user = await User.findOne({
        where: {
          email: userData.email
        }
      });
  
      if (!user) throw { status: 404, message: "Bad Request" }
  
      const data = {
        userId: user.id,
        productId
      }
      await Purchase.create(data)
      .then(data => {
        logger.info('Product has been purchased');
        res.status(201).json({
          message: 'Product has been purchased',
          data
        })
      })
      .catch(err => {
        throw err;
      })
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PurchaseController;