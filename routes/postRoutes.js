const express = require("express")
const router = express.Router()
const {publishPost,getFriendsPost,commentPost,likePost,getCommentsByPost,getPostByUser} = require('../controllers/Postcontroller')
const {authUser} = require('../middleware/auth')


router.route("/publish").post(authUser,publishPost)
router.route("/getFriendsPost").get(authUser,getFriendsPost)
router.route("/commentPost").post(authUser,commentPost)
router.route("/LikePost").post(authUser,likePost)
router.route("/postByUser").get(authUser,getPostByUser)
router.route("/getComments").get(authUser,getCommentsByPost)


module.exports = router