const express = require("express")
const router = express.Router()
const {getTopStories,getNewsByCategory} = require('../controllers/Newscontroller')
const {authUser} = require('../middleware/auth')

/**
 * @swagger
 * /getTopStories:
 *   get:
 *     description: get top stories from news api
 */
router.route("/getTopStories").get(authUser,getTopStories)
/**
 * @swagger
 * /getNewsCategory/{category}:
 *   get:
 *     description: get news by category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: name of the news category
 *         schema:
 *           type: string
 */


router.route("/getNewsCategory/:category").get(authUser,getNewsByCategory)

module.exports = router