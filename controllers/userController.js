const logger = require("../middlewares/utils/logger");
const { User } = require('../models');
const SALT_ROUNDS = +process.env.SALT_ROUNDS;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = async (id) => {
  const token = jwt.sign({ id }, process.env.TOKEN_SECRET);
  return token;
};

class UserController {

  static async register(req, res, next) {
    try {
      logger.info("Masuk register");
      const salt = bcrypt.genSaltSync(SALT_ROUNDS);
      const hash = bcrypt.hashSync(req.body.password, salt);
      
      const user = {
        name: req.body.name,
        role: req.body.role,
        password: hash,
        email: req.body.email
      };
      
      if (!user.name || !user.role || !user.password || !user.email) {
        throw { status: 400, message: "Data tidak lengkap" }
      }

      const existingData = await User.findOne({
        where: {
          email: user.email
        }
      })

      if (existingData) throw { status: 400, message: "Email already exist" };

      await User.create(user).then(data => {
        logger.info('Adding data success');
        res.status(201).json({
          message: "Adding data success",
          data
        })
      })
      .catch((err) => {
        logger.error(err.message)
        throw { status: 400, message: 'Adding data unsuccess'}
      })

    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const data = {
        email: req.body.email,
        password: req.body.password
      }
  
      if (!data.email || !data.password) throw { status: 400, message: "Data tidak lengkap"};
  
      logger.info('User data checking')
      const user = await User.findOne({
        where: {
          email: data.email
        }
      });
  
      if (!user) throw { status: 404, message: "email or password wrong" };  
      
      logger.info('Password Checking')
      const cekPassword = bcrypt.compareSync(data.password, user.password);

      if (!cekPassword) throw { status: 401, message: "email or password wrong" }

      const token = await generateToken({
        email: data.email,
        name: user.name,
        role: user.role
      });

      res.status(200).json({
        token
      });

    } catch (error) {
      next(error);
    }

  }

  static async getAll(req, res, next) {
    try {
      await User.findAll({
        raw: true,
        attributes: ['name', 'role']
      })
      .then(data => {
        logger.info('All User Data has been fetched');
        res.status(200).json({
          message: "All User Data has been fetched",
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

module.exports = UserController;