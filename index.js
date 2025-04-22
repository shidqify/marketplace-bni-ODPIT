const express = require("express");
// const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const path = require('path');
const logger = require('./middlewares/utils/logger');
// const upload = require('./middlewares/fileUpload');
const morganStream = require("./middlewares/utils/morganStream");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml');

// our routes
const indexRouter = require("./routers/index");

// Setup Express
const app = express();

// for body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

//cors middleware
app.use(cors());

// morgan logger for dev
app.use(morgan(':method: :url :status :response-time ms - :res[content-length]', { stream: morganStream }));


// Database Setup
// const dbURI = process.env.DB_URI;

// mongoose.connect(dbURI);

// //test database connection
// let db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   logger.info("Database connected succefully...");
// });

// general path
app.get('/', (req, res) => {
  logger.info('Accessing API');
  res.status(200).json({
    message: "Welcome to this API"
  });
})

// Set up our main routes
app.use("/api", indexRouter);

// Set up docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to serve static files (for download)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// if the request passes all the middleware without a response
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// for general error handling
app.use((error, req, res, next) => {
  logger.error(error)
  res.status(error.status || 500).json({
    message: error.message
  });
});

// App's connection port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Server is connected on port ${PORT}`);
  logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
