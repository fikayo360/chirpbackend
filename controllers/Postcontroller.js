const Post = require('../models/Post')
const User = require('../models/User')
const Notification = require('../models/Notifications')
const customError = require('../errors')
const tryCatch = require('../utils/tryCatch')
const { StatusCodes } = require('http-status-codes')


const publishPost = tryCatch(
    async(req,res) => {
        const {postImg,postAuthor,postTitle,postBody} = req.body
        
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const newPost = await Post.create({userId:sessionUser._id,postImg,postAuthor,postTitle,postBody})
        const createNotifications = Promise.all(sessionUser.friends.map(async(friend)=>{
            const foundFriend = await User.findOne({ username: friend })
            const notification = await Notification.create({ userId:foundFriend._id,
            ProfilePic:sessionUser.profilepic,
            username:sessionUser.username,
            body:`${sessionUser.username} added a new post`})
            const saved = await notification.save()
            console.log(saved)
        }))
        res.status(StatusCodes.OK).json('post created ')
    }
)

const getFriendsPost = tryCatch(
    async(req,res) => {
            const sessionUser = await User.findOne({username:req.user.username})
            console.log(sessionUser);
            if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const posts = await Promise.all(
                sessionUser.friends.map(async (user) => {
                    let friendProfile = await User.findOne({username: user})
                    const todaysPosts = await Post.find({
                        $and: [
                          { userId: friendProfile._id },
                          { createdAt: { $gte: today } }
                        ]
                      });
                      return todaysPosts; 
                })
            )
            
            if (posts.length > 0) {res.status(StatusCodes.OK).json(posts)}
            else{return res.status(StatusCodes.BAD_REQUEST).json('no posts found')}
    }
) 

const commentPost = tryCatch(
    async(req,res) => {
      
            const {PostId,PostcommentAuthor,PostcommentBody,PostcommentProfilePic} = req.body
            console.log(req.body);
            let newComment = {PostId,PostcommentAuthor,PostcommentProfilePic,PostcommentBody}
            let currentPost = await Post.findById({_id:PostId})
            
            currentPost.postComments.push(newComment)
            await currentPost.save()
            
            res.status(StatusCodes.OK).json('comment added succesfully')
    }
) 

const getPostByUser = tryCatch(
    async(req,res) => {
       
    const sessionUser = await User.findOne({username:req.user.username})
    console.log(sessionUser);
    if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
    const userPost = await Post.find({userId:sessionUser._id})
    res.status(StatusCodes.OK).json(userPost)
    }
) 

const getCommentsByPost = tryCatch(
    async(req,res) => {
        const PostId = req.query.PostId;
            const sessionUser = await User.findOne({username:req.user.username})
            console.log(sessionUser);
            if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
            const comments = await Post.findOne({_id:PostId})
            res.status(StatusCodes.OK).json(comments);
    }
) 

const likePost = tryCatch(
    async (req, res) => {
          const { authorName, postId } = req.body;
          let newLike = { authorName, postId };
          let currentPost = await Post.findById({ _id: postId });
    
          if (currentPost.postLikes.some((item) => item.authorName === newLike.authorName)) {
            return res.status(StatusCodes.BAD_REQUEST).json('Already liked post');
          }
      
          // Add the new like to the postLikes array
          currentPost.postLikes.push(newLike);
          await currentPost.save();
          res.status(StatusCodes.OK).json('Liked');
      }
) 



module.exports = {publishPost,getFriendsPost,commentPost,likePost,getCommentsByPost,getPostByUser}