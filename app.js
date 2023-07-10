const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
const cors = require('cors');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const cookieParser = require('cookie-parser');
const userRoute = require('./routes/userRoutes')
const savedPostRoute = require('./routes/savedPostRoutes')
const postRoute = require('./routes/postRoutes')
const notificationRoute = require('./routes/notificationRoutes')
const newsRoute = require('./routes/newsRoutes')
app.use(cors());
app.use(express.json());


//app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser(process.env.JWT_SECRET));
app.use('/api/v1/user', userRoute);
app.use('/api/v1/savedPost', savedPostRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/news', newsRoute);

/*
const http = require('http');
const server = http.createServer(npm install mongodbapp);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://fksocial.netlify.app",
  },
});
   
  let users = []

  const removeUser = (socketId) => {
    users = users.filter((user) =>
     user.socketId !== socketId);
  };

  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  };
  
  const getUser = (userId) => {
    return users.find((user) => 
    user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connection happens
    console.log("a user connected.");
    io.emit("welcome","this is socket server duh")
    
      //take userId and socketId from user
  socket.on("addUser", (userId) => {
    console.log(userId)
    addUser(userId, socket.id);
    console.log(users)
    console.log(users.length)
    io.emit("getUsers", users);
  });
  
  //send and get posts 
  socket.on("sendPosts", 
  ({ sender, receiverId, postImg,postTitle,postBody,postAuthor,postAuthorImg,postLikes,postComments }) => {
    console.log({sender, receiverId, postImg,postTitle,postBody,postAuthor,postAuthorImg,postLikes,postComments})
    const user = getUser(receiverId);
    console.log(user)
    io.to(user.socketId).emit("getPosts", {
      sender, receiverId, postImg,postTitle,postBody,postAuthor,postAuthorImg,postLikes,postComments
    });
  });

  //send and get notification
  socket.on("sendnotification",
  ({sender,body,individualpic,receiverid}) => {
    console.log({sender,body,individualpic,receiverid})
    const user = getUser(receiverid);
    console.log(user)
    io.to(user.socketId).emit("getnotifications", {
      sender,body,individualpic
    })
  })

   //when disconnect
   socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  })
  })
*/

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

// rest of the packages
//const morgan = require('morgan');
//const fileUpload = require('express-fileupload');
//const rateLimiter = require('express-rate-limit');
//const helmet = require('helmet');
//const xss = require('xss-clean');


//const mongoSanitize = require('express-mongo-sanitize');

// database


//  routers
/*


// middleware


app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
*/


//
//app.use(fileUpload());

/*
*/

