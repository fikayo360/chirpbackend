const Post = require('../models/Post')
const User = require('../models/User')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes')


const publishPost = async(req,res) => {
    const {postImg,postAuthor,postTitle,postBody} = req.body
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const newPost = await Post.create({userId:sessionUser._id,postImg,postAuthor,postTitle,postBody})
        res.status(StatusCodes.OK).json('post created ')
    }catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('error creating posts ')
    }
}

const getFriendsPost = async(req,res) => {
    try{
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
                return [...todaysPosts]
            })
        )
        res.status(StatusCodes.OK).json(posts)
    }
       catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('error getting items')
    }
}

const commentPost = async(req,res) => {
    try{
        const {PostId,PostcommentAuthor,PostcommentBody,PostcommentProfilePic} = req.body
        console.log(req.body);
        let newComment = {PostId,PostcommentAuthor,PostcommentProfilePic,PostcommentBody}
        let currentPost = await Post.findById({_id:PostId})
        
        currentPost.postComments.push(newComment)
        await currentPost.save()
        
        res.status(StatusCodes.OK).json('comment added succesfully')
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}

const getPostByUser = async(req,res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        console.log(sessionUser);
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const userPost = await Post.find({userId:sessionUser._id})
        res.status(StatusCodes.OK).json(userPost)
    }catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('error occured')
    }
}

const getCommentsByPost = async(req,res) => {
    const PostId = req.query.PostId;
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        console.log(sessionUser);
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const comments = await Post.findOne({_id:PostId})
        res.status(StatusCodes.OK).json(comments);
    }catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('error getting comments');
    }
}

const likePost = async(req,res) => {
    try{
        const {authorName,postId} = req.body
        let newlike = {authorName,postId}
        let currentPost = await Post.findById({_id:postId})
        currentPost.postLikes.map(item => {
            if(item.authorName === newlike.authorName ){
                res.status(StatusCodes.BAD_REQUEST).json('already liked post')
            }
    })
        currentPost.postLikes.push(newlike)
        await currentPost.save()
        res.status(StatusCodes.OK).json('liked')
    }catch(err){       
        res.status(StatusCodes.BAD_REQUEST).json('errror occured')
    }
}



module.exports = {publishPost,getFriendsPost,commentPost,likePost,getCommentsByPost,getPostByUser}