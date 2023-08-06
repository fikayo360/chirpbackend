const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());

const userRoute = require('./routes/userRoutes')
const savedPostRoute = require('./routes/savedPostRoutes')
const postRoute = require('./routes/postRoutes')
const notificationRoute = require('./routes/notificationRoutes')
const newsRoute = require('./routes/newsRoutes')
// rest of the packages
//const morgan = require('morgan');
//const fileUpload = require('express-fileupload');
//const rateLimiter = require('express-rate-limit');
//const helmet = require('helmet');
//const xss = require('xss-clean');

//app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/savedPost', savedPostRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/news', newsRoute);



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


