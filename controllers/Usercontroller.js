const User = require('../models/User')
const bcrypt = require("bcrypt")
const {validateEmail }= require('../utils/validateEmail')
const {sendResetToken} = require('../utils/sendResetToken')
const customError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const {sendEmailConfirmation} = require('../utils/sendEmail')
const jwt = require('jsonwebtoken');

const register = async(req,res) => {
    const {username,email,password,state,zipcode} = req.body

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

    try{
        const savedUser  = await User.create({username,email, password: bcrypt.hashSync(password, 10),state,zipcode})
        const tokenUser = createTokenUser(savedUser)
        attachCookiesToResponse({res,user:tokenUser})
        res.status(StatusCodes.OK).json({user:tokenUser})
       sendEmailConfirmation(savedUser.email)
    }
    catch(err){
        res.status(StatusCodes.BAD_REQUEST).json(err)
    }
}

const login = async(req,res) => {
    
    const {username,password} = req.body
    if (!username || !password){
         return res.status(500).json("pls ensure fields are not empty ")
      }
    try{  
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
    catch(err){
        return res.status(StatusCodes.BAD_REQUEST).json(err)
    }
}

const sessionUser = async (req, res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if (!sessionUser){
            return res.status(404).json('user not found')
        }
        const { password, ...others } = sessionUser._doc;
            res.status(StatusCodes.OK).json(others)
    }
    catch(err){
        throw new customError.BadRequestError(err)
    }
}

const forgotPassword = async (req,res) => {
    const {emailaddress} = req.body
    const sessionUser = await User.findOne({email:emailaddress})
    if (!sessionUser){
        return res.status(404).json('that user does not exist')
    }
    try{
            let reset = sendResetToken(sessionUser.email)
            sessionUser.resettoken = reset
            await sessionUser.save()
            console.log(sessionUser)
            res.status(200).json('Reset token sent successfully')
    }
    catch(err){
        throw new customError.BadRequestError(err)
    }
}

const changePassword = async (req,res) => {
    const {token,emailaddress,newPassword} = req.body
    const sessionUser = await User.findOne({email:emailaddress})
      try{
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
            res.status(StatusCodes.BAD_REQUEST).json('wrong user');
        }
        }
      
        catch(err){
            throw new customError.BadRequestError(err)
        }
}

const findFriend = async (req,res) => {
    const { username } = req.body
    
    try{
        const foundUser = await User.findOne({username})
        if(!foundUser){
            return res.status(StatusCodes.BAD_REQUEST).json('user not does not exist')
        }
        const { password, ...others } = foundUser._doc;
        res.status(StatusCodes.OK).json(others)
    }
    catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('user not found')
    }
    /*
    
    */
    
}

const follow = async (req,res) => {
    const {friendName} = req.params
    let newFriends = []
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        if(friendName === sessionUser.username){throw new customError.BadRequestError('cant add yourself')}

        if(!sessionUser.friends.includes(friendName)){
            newFriends = [...sessionUser.friends,friendName]
            sessionUser.friends = newFriends
            sessionUser.save()
            res.status(StatusCodes.OK).json(`${friendName} added succesfully`)
        }else{
            res.status(StatusCodes.OK).json(`error adding user`)
        }
    }catch(err){
        res.status(StatusCodes.OK).json(err)
    }
}

const unFollow = async (req,res) => {
    const sessionUser = await User.findOne({username:req.user.username})
    const {friendName} = req.params
    try{
      
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        if(sessionUser.friends.includes(friendName)){
            let newUsers = sessionUser.friends.filter(item => item !== friendName)
            sessionUser.friends = newUsers
            sessionUser.save()
            res.status(StatusCodes.OK).json(`${friendName} removed succesfully`)
        }
        else{
            throw new customError.BadRequestError('error occured while removing friend')
        }
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}

const aroundYou = async (req,res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        let aroundYou = []
        const sameZip = await User.find({zipcode:sessionUser.zipcode})
        const filteredSameZip = sameZip.filter((user) => user._id.toString() !== sessionUser._id.toString());
        const sameStates = await User.find({state:sessionUser.state})
        const filteredSameStates = sameStates.filter((user) => user._id.toString() !== sessionUser._id.toString());
        aroundYou = [...filteredSameZip,...filteredSameStates]
        res.status(StatusCodes.OK).json(aroundYou)
    }catch(err){
        res.status(StatusCodes.BAD_REQUEST).json('error getting users')
    }
}

 
const completeProfile = async (req,res) => {
    const {phonenumber,profilepic,Bio,country,state,zipcode} = req.body
    try{
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
          foundUser.save()
          res.status(StatusCodes.OK).json(`${sessionUser.username} profile updated `)
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}
  

const following = async (req,res) => {
    try{
        const sessionUser = await User.findOne({username:req.user.username})
        if(!sessionUser){throw new customError.NotFoundError('sesseion user not found')}
        const following = await Promise.all(
            sessionUser.friends.map(async (friend) => {
              const foundFriend = await User.findOne({ username: friend })
              const { password, ...others } = foundFriend._doc
              return others
            })
          );
          
          console.log(following);
        
        res.status(StatusCodes.OK).json(following)
    }catch(err){
        throw new customError.BadRequestError(err)
    }
}

const followers = async(req,res) => {
    try{
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
    }catch(err){
        throw new customError.BadRequestError(err) 
    }
}

module.exports = {register,login,forgotPassword,changePassword,findFriend,follow,unFollow,aroundYou,following,followers,completeProfile,sessionUser}