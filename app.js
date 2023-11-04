const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit')
const userRoute = require('./routes/userRoutes')
const savedPostRoute = require('./routes/savedPostRoutes')
const postRoute = require('./routes/postRoutes')
const notificationRoute = require('./routes/notificationRoutes')
const newsRoute = require('./routes/newsRoutes')

const appLimiter = rateLimiter({
  windowMs:1000,
  max:100
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/savedPost', savedPostRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/news', newsRoute);
app.use(cors());
app.use(express.json());
app.use(notFoundMiddleware())
app.use(appLimiter())



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


