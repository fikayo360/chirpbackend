const express = require("express")
const router = express.Router()
const {createSavedPost,getSavedPosts,deleteSavedPost} = require('../controllers/Savedpostcontroller')
const {authUser} = require('../middleware/auth')

/**
 * @swagger
 * /createSavedPost:
 *   post:
 *     description: create a new saved post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SavedPostImg:
 *                 type: string
 *               SavedPostAuthor:
 *                 type: string
 *               SavedPostTitle:
 *                 type: string
 *               SavedPostBody:
 *                 type: string
 *     responses:
 *       201:
 *         description: saved post created successfully
 */

router.route("/createSavedPost").post(authUser,createSavedPost)
/**
 * @swagger
 * /getSavedPosts:
 *   get:
 *     description: get saved posts
 */
router.route("/getSavedPosts").get(authUser,getSavedPosts)
/**
 * @swagger
 * /deleteSavedPost/{savedpostId}:
 *   post:
 *     description: delete a saved post
 *     parameters:
 *       - in: path
 *         name: savedpostId
 *         required: true
 *         description: ID of the saved post
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: deleted
 */

router.route("/deleteSavedPost/{savedpostId}").delete(authUser,deleteSavedPost)


module.exports = router