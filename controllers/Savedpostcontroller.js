const Savedpost = require('../models/Savedpost')
const User = require('../models/User')
const customError = require('../errors')
const tryCatch = require('../utils/tryCatch')
const { StatusCodes } = require('http-status-codes')

const createSavedPost = tryCatch(
    async(req,res) => {
        const {SavedPostImg,SavedPostAuthor,SavedPostTitle,SavedPostBody} = req.body
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const newSavedPost = await Savedpost.create({userId:sessionUser._id,SavedPostImg,
        SavedPostAuthor,SavedPostTitle,SavedPostBody})
        res.status(StatusCodes.OK).json('saved succesfully')
    }
) 

const getSavedPosts = tryCatch(
    async(req,res) => {
        
    const sessionUser = await User.findOne({username:req.user.username})
    if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
    const savedPosts = await Savedpost.find({userId:sessionUser._id})
    if(savedPosts.length > 0){res.status(StatusCodes.OK).json(savedPosts)}
    else{
        return res.status(StatusCodes.BAD_REQUEST).json('no posts found')
    }
    }
) 

const deleteSavedPost = tryCatch(
    async(req,res) => {
        const {savedpostId} = req.params
        const sessionUser = await User.findOne({username:req.user.username})
        
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const deletepost = await Savedpost.findByIdAndDelete({ _id: savedpostId });
        res.status(StatusCodes.OK).json('deleted')
    }
) 

module.exports = {createSavedPost,getSavedPosts,deleteSavedPost}