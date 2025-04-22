const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    server: {
      url: `http://localhost:${process.env.PORT}`
    }
  },
  apis: ['./src/routes*.js'], // files containing annotations as above
};

module.exports.openapiSpecification = swaggerJsdoc(options);
