const User = require('../models/User')
const bcrypt = require("bcrypt")
const {validateEmail }= require('../utils/validateEmail')
const {sendResetToken} = require('../utils/sendResetToken')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const {sendEmailConfirmation} = require('../utils/sendEmail')
const jwt = require('jsonwebtoken');
const tryCatch = require('../utils/tryCatch')


const register = 
    async(req,res) => {
        const {username,email,password} = req.body
    
        if (!username || !email || !password){
            res.status(StatusCodes.BAD_REQUEST).json('fields cant be empty')
          }
    
        if(validateEmail(email) === false){
            res.status(StatusCodes.BAD_REQUEST).json('invalid mail')
        }
    
        const foundUser = await User.findOne({username})
        
        const foundEmail = await User.findOne({email})
    
        if (foundEmail || foundUser) {
            res.status(StatusCodes.BAD_REQUEST).json('user already exists')
        }
        const savedUser  = await User.create({username,email, password: bcrypt.hashSync(password, 10)})
        const tokenUser = createTokenUser(savedUser)
        attachCookiesToResponse({res,user:tokenUser})
        res.status(StatusCodes.CREATED).json({user:tokenUser})
        sendEmailConfirmation(savedUser.email)
    }

const login = tryCatch(
    async(req,res) => {
    
        const {username,password} = req.body
        if (!username || !password){
             return res.status(500).json("pls ensure fields are not empty ")
          }
       
        const foundUser = await User.findOne({username})
        console.log(foundUser);
        if(!foundUser){
            return res.status(StatusCodes.BAD_REQUEST).json('that user does not exist')
        }
        
        if(!bcrypt.compareSync(password,foundUser.password)){
           return res.status(StatusCodes.BAD_REQUEST).json('wrong password')
         }
         const { password: foundUserPassword, ...others } = foundUser._doc;
         const tokenUser = createTokenUser(others);
         let cookie = attachCookiesToResponse({ res, user: tokenUser });
         return res.status(StatusCodes.OK).json({ user: others,cookie });
    }
) 

const sessionUser = tryCatch(
    async (req, res) => {
        
            const sessionUser = await User.findOne({username:req.user.username})
            if (!sessionUser){
                return res.status(404).json('user not found')
            }
            const { password, ...others } = sessionUser._doc;
                res.status(StatusCodes.OK).json(others)
        
    }
) 

const forgotPassword = tryCatch(
    async (req,res) => {
        const {emailaddress} = req.body
        const sessionUser = await User.findOne({email:emailaddress})
        if (!sessionUser){
            return res.status(404).json('that user does not exist')
        }
    
        let reset = sendResetToken(sessionUser.email)
        sessionUser.resettoken = reset
        await sessionUser.save()
        console.log(sessionUser)
        res.status(200).json('Reset token sent successfully')
    }
) 

const changePassword = tryCatch(
    async (req,res) => {
        const {token,emailaddress,newPassword} = req.body
        const sessionUser = await User.findOne({email:emailaddress})
          
        const { email } = jwt.verify(token,process.env.JWT_SECRET);
        console.log(email);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        if(email === sessionUser.email){
            sessionUser.password = hashedPassword;
            sessionUser.resettoken = undefined;
            await sessionUser.save();
            res.status(StatusCodes.OK).json('password updated successfully');
        }
        else{
            return res.status(StatusCodes.BAD_REQUEST).json('wrong user');
        }
    }
) 

const findFriend = tryCatch(async (req,res) => {
    const { username } = req.body

    const foundUser = await User.findOne({username})
    if(!foundUser){
        return res.status(StatusCodes.BAD_REQUEST).json('user not does not exist')
    }
    const { password, ...others } = foundUser._doc;
    res.status(StatusCodes.OK).json(others)
}) 

const follow = tryCatch(
    async (req,res) => {
        const {friendName} = req.params
        let newFriends = []
        
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        if(friendName === sessionUser.username){throw new customError.BadRequestError('cant add yourself')}

        if(!sessionUser.friends.includes(friendName)){
            newFriends = [...sessionUser.friends,friendName]
            sessionUser.friends = newFriends
            sessionUser.save()
            res.status(StatusCodes.OK).json(`${friendName} added succesfully`)
        }else{
            return res.status(StatusCodes.OK).json(`error adding user`)
        }
    }
) 

const unFollow = tryCatch(
    async (req,res) => {
        const sessionUser = await User.findOne({username:req.user.username})
        const {friendName} = req.params
        
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        if(sessionUser.friends.includes(friendName)){
            let newUsers = sessionUser.friends.filter(item => item !== friendName)
            sessionUser.friends = newUsers
            sessionUser.save()
            res.status(StatusCodes.OK).json(`${friendName} removed succesfully`)
        }
        else{
            return res.status(StatusCodes.BAD_REQUEST).json('error occured while removing friend')
        }
    }
) 

const aroundYou = tryCatch(
    async (req,res) => {
        
    const sessionUser = await User.findOne({username:req.user.username})
    if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
    let aroundYou = []
    const sameZip = await User.find({zipcode:sessionUser.zipcode})
    const filteredSameZip = sameZip.filter((user) => user._id.toString() !== sessionUser._id.toString());
    const sameStates = await User.find({state:sessionUser.state})
    const filteredSameStates = sameStates.filter((user) => user._id.toString() !== sessionUser._id.toString());
    aroundYou = [...filteredSameZip,...filteredSameStates]
    if (aroundYou.length > 0){res.status(StatusCodes.OK).json(aroundYou)}
    else{res.status(StatusCodes.BAD_REQUEST).json('no items found')}
    }
) 
 
const completeProfile = tryCatch(
    async (req,res) => {
        const {phonenumber,profilepic,Bio,country,state,zipcode} = req.body
       
        const sessionUser = await User.findOne({username:req.user.username})
        let foundUser = await User.findOne({username:sessionUser.username})         
        Object.assign(foundUser,{
        phonenumber:phonenumber,
        profilepic:profilepic,
        Bio: Bio,
        country: country,
        state: state,
        zipcode: zipcode
        })
        const updatedUser = await foundUser.save()
        res.status(StatusCodes.OK).json(`${updatedUser.username} profile updated `)
    }
) 
  

const following = tryCatch(
    async (req,res) => {

    const sessionUser = await User.findOne({username:req.user.username})
    if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
    const following = await Promise.all(
        sessionUser.friends.map(async (friend) => {
            const foundFriend = await User.findOne({ username: friend })
            const { password, ...others } = foundFriend._doc
            return others
        })
        );
        
        if (following.length > 0) { res.status(StatusCodes.OK).json(following)}
        else{ return res.status(StatusCodes.BAD_REQUEST).json('no items found') }
           
    }
) 

const followers = tryCatch(
    async(req,res) => {
    const sessionUser = await User.findOne({username:req.user.username})
    if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
    
        User.find({}, (err, users) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return;
        }
        
        let followers= []
        users.map((user) => {
            if(user.friends.includes(sessionUser.username)){
                const { password, ...others } = user._doc
                followers.push(others)
            }
        })
        res.status(StatusCodes.OK).json(followers)
        });
    }
) 

module.exports = {register,login,forgotPassword,changePassword,findFriend,follow,unFollow,aroundYou,following,followers,completeProfile,sessionUser}