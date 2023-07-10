const User = require('../models/User')
const Notification = require('../models/Notifications')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes');


const getNotications = async (req,res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const notifications = await Notification.find({userId:sessionUser._id})
        res.status(StatusCodes.OK).json(notifications)
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}

const createNotifications = async(req,res) => {
    const {profilePic,username,body} = req.body
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const notificationItem = await Notification.create({userId:sessionUser._id,profilePic,username,body})
        res.status(StatusCodes.OK).json('saved succesfully')
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}

module.exports = {getNotications,createNotifications}