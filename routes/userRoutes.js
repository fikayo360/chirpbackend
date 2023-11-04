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

router.route("/signup").post(signupLimiter(),register)
router.route("/login").post(LoginLimiter(),login)
router.route("/search").post(authUser,findFriend)
router.route("/forgotPassword").post(forgotPassword)
router.route("/changePassword").post(changePassword)
router.route("/follow/:friendName").get(authUser,follow)
router.route("/getUser").get(authUser,sessionUser)
router.route("/unfollow/:friendName").get(authUser,unFollow)
router.route("/aroundYou").get(authUser,aroundYou)
router.route("/following").get(authUser,following)
router.route("/aroundYou").get(authUser,aroundYou)
router.route("/followers").get(authUser,followers)
router.route("/updateProfile").post(authUser,completeProfile)
module.exports = router