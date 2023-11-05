const express = require("express")
const router = express.Router()
const {register,login,forgotPassword,changePassword,findFriend,follow,unFollow,aroundYou,following,followers,completeProfile,sessionUser} = require('../controllers/Usercontroller')
const {authUser} = require('../middleware/auth')
const rateLimiter = require('express-rate-limit')

const LoginLimiter = rateLimiter({
    windowMs:60 * 1000,
    max:10,
    message:'pls try again later '
})

const signupLimiter = rateLimiter({
    windowMs:60 * 1000,
    max:10,
    message:'Too many accounts created from this IP, please try again after an hour"'
})

/**
 * @swagger
 * /user:
 *   post:
 *     description: create a new user
 */

router.route("/signup").post(signupLimiter(),register)

/**
 * @swagger
 * /user:
 *   post:
 *     description: authenticate user  
 */

router.route("/login").post(LoginLimiter(),login)

/**
 * @swagger
 * /user:
 *   post:
 *     description: search for a user
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/search").post(authUser,findFriend)
/**
 * @swagger
 * /books:
 *   post:
 *     description: forgot password
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/forgotPassword").post(forgotPassword)
/**
 * @swagger
 * /books:
 *   post:
 *     description: change password
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/changePassword").post(changePassword)
/**
 * @swagger
 * /books:
 *   get:
 *     description: follow a user
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/follow/:friendName").get(authUser,follow)
/**
 * @swagger
 * /books:
 *   get:
 *     description: Get a user
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/getUser").get(authUser,sessionUser)
/**
 * @swagger
 * /books:
 *   get:
 *     description: look for a user and remove 
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/unfollow/:friendName").get(authUser,unFollow)
/**
 * @swagger
 * /books:
 *   get:
 *     description: Get people around you
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/aroundYou").get(authUser,aroundYou)
/**
 * @swagger
 * /books:
 *   get:
 *     description: returns all a users followers
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/following").get(authUser,following)

/**
 * @swagger
 * /books:
 *   get:
 *     description: return a lists of people are following a user
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/followers").get(authUser,followers)
/**
 * @swagger
 * /books:
 *   post:
 *     description: update a profile
 *     responses:
 *       200:
 *         description: Success
 * 
 */

router.route("/updateProfile").post(authUser,completeProfile)


module.exports = router