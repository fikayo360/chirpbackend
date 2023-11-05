const express = require("express")
const router = express.Router()
const {publishPost,getFriendsPost,commentPost,likePost,getCommentsByPost,getPostByUser} = require('../controllers/Postcontroller')
const {authUser} = require('../middleware/auth')

/**
 * @swagger
 * /publish:
 *   post:
 *     description: create a new post
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postImg:
 *                 type: string
 *               postAuthor:
 *                 type: string
 *               postTitle:
 *                 type: string
 *               postBody:
 *                 type: string
 *  responses:
 *       201:
 *         description: post created succesfully
 */
router.route("/publish").post(authUser,publishPost)
/**
 * @swagger
 * /getFriendsPost:
 *   get:
 *     description: get friends post
 */
router.route("/getFriendsPost").get(authUser,getFriendsPost)
/**
 * @swagger
 * /commentPost:
 *   post:
 *     description: create a new comment
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PostId:
 *                 type: string
 *               PostcommentAuthor:
 *                 type: string
 *               PostcommentBody:
 *                 type: string
 *               PostcommentProfilePic:
 *                 type: string
 *  responses:
 *       201:
 *         description: comment added succesfully
 */
router.route("/commentPost").post(authUser,commentPost)
/**
 * @swagger
 * /LikePost:
 *   post:
 *     description: like a post
 *  requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               authorName:
 *                 type: string
 *               postId:
 *                 type: string
 *              
 *  responses:
 *       200:
 *         description: liked post
 */
router.route("/LikePost").post(authUser,likePost)
/**
 * @swagger
 * /postByUser:
 *   post:
 *     description: gets post by user
 */
router.route("/postByUser").get(authUser,getPostByUser)
/**
 * @swagger
 * /createSavedPost:
 *   post:
 *     description: get comments by post
 */
router.route("/getComments").get(authUser,getCommentsByPost)


module.exports = router