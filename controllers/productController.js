const logger = require("../middlewares/utils/logger");
const { Purchase, User, Product } = require('../models');

class ProductController {
  static async addProduct(req, res, next) {
    try {
      const data = {
        name: req.body.name,
        price: req.body.price? req.body.price : 0,
      }

      if (data.price == 0) throw { status: 400, message: "Product data is not complete" }

      // Check product exist
      const product = await Product.findOne({
        where : {
          name: data.name
        }
      })

      if (product) throw { status: 400, message: "Product already exist" };
      
      await Product.create(data)
      .then(data => {
        logger.info('Add Product Success');
        res.status(201).json({
          message: "Add Product Success",
          data
        });
      })
      .catch(err => {
        throw err;
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;