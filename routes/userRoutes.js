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
 * /signup:
 *   post:
 *     description: create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: user created successfully
 */


router.route("/signup").post(signupLimiter,register)

/**
 * @swagger
 * /login:
 *   post:
 *     description: authenticate user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 */

router.route("/login").post(LoginLimiter,login)

/**
 * @swagger
 * /search:
 *   post:
 *     description: search for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 */

router.route("/search").post(authUser,findFriend)
/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     description: forgot password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailaddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset token sent successfully
 */

router.route("/forgotPassword").post(forgotPassword)
/**
 * @swagger
 * /changePassword:
 *   post:
 *     description: change password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               emailaddress:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: password updated successfully
 */

router.route("/changePassword").post(changePassword)
/**
 * @swagger
 * /follow/{friendName}:
 *   get:
 *     description: follow a user
 *     parameters:
 *       - in: path
 *         name: friendName
 *         required: true
 *         description: ID of the friend name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: added successfully
 */

router.route("/follow/:friendName").get(authUser,follow)
/**
 * @swagger
 * /getUser:
 *   get:
 *     description: Get a user
 *     responses:
 *       200:
 *         description: Success
 */

router.route("/getUser").get(authUser,sessionUser)
/**
 * @swagger
 * /unfollow/{friendName}:
 *   get:
 *     description: look for a user and remove 
 *     parameters:
 *       - in: path
 *         name: friendName
 *         required: true
 *         description: ID of the friend name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: removed successfully
 */

router.route("/unfollow/:friendName").get(authUser,unFollow)
/**
 * @swagger
 * /aroundYou:
 *   get:
 *     description: Get people around you
 *     responses:
 *       200:
 *         description: Success
 */

router.route("/aroundYou").get(authUser,aroundYou)
/**
 * @swagger
 * /following:
 *   get:
 *     description: Returns all a user's followers
 *     responses:
 *       200:
 *         description: Success
 */

router.route("/following").get(authUser,following)

/**
 * @swagger
 * /followers:
 *   get:
 *     description: Return a list of people following a user
 *     responses:
 *       200:
 *         description: Success
 */

router.route("/followers").get(authUser,followers)
/**
 * @swagger
 * /updateProfile:
 *   post:
 *     description: Update a profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phonenumber:
 *                 type: string
 *               profilepic:
 *                 type: string
 *               Bio:
 *                 type: string
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               zipcode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */

router.route("/updateProfile").post(authUser,completeProfile)


module.exports = router