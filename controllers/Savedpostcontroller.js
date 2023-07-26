const Savedpost = require('../models/Savedpost')
const User = require('../models/User')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes')

const createSavedPost = async(req,res) => {
    const {SavedPostImg,SavedPostAuthor,SavedPostTitle,SavedPostBody} = req.body
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const newSavedPost = await Savedpost.create({userId:sessionUser._id,SavedPostImg,
        SavedPostAuthor,SavedPostTitle,SavedPostBody})
        res.status(StatusCodes.OK).json('saved succesfully')
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).json('error saving post')
    }
}

const getSavedPosts = async(req,res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const savedPosts = await Savedpost.find({userId:sessionUser._id})
        res.status(StatusCodes.OK).json(savedPosts)
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).json(err)
    }
}

const deleteSavedPost = async(req,res) => {
    const {savedpostId} = req.params
    try{
        const sessionUser = await User.findOne({username:req.user.username})
      
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const deletepost = await Savedpost.findByIdAndDelete({ _id: savedpostId });
        res.status(StatusCodes.OK).json('deleted')
    }catch(err){
        return res.status(StatusCodes.BAD_REQUEST).json(err)
    }
}

module.exports = {createSavedPost,getSavedPosts,deleteSavedPost}