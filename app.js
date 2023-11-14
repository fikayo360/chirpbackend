const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const rateLimiter = require('express-rate-limit')
const userRoute = require('./routes/userRoutes')
const savedPostRoute = require('./routes/savedPostRoutes')
const postRoute = require('./routes/postRoutes')
const notificationRoute = require('./routes/notificationRoutes')
const newsRoute = require('./routes/newsRoutes')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const appLimiter = rateLimiter({
  windowMs:1000,
  max:100
})

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Library API",
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.set('trust proxy', 1);
app.use(errorHandlerMiddleware);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/savedPost', savedPostRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/news', newsRoute);
app.use(cors());
app.use(express.json());
app.use(appLimiter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));


const port = process.env.PORT || 5000;
const start =  () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

start();


module.exports = app