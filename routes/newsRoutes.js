const express = require("express")
const router = express.Router()
const {getTopStories,getNewsByCategory} = require('../controllers/Newscontroller')
const {authUser} = require('../middleware/auth')

router.route("/getTopStories").get(authUser,getTopStories)
router.route("/getNewsCategory/:category").get(authUser,getNewsByCategory)

module.exports = router