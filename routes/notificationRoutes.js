const express = require("express")
const router = express.Router()
const {getNotications,createNotifications} = require('../controllers/Notificationscontroller')
const {authUser} = require('../middleware/auth')


router.route("/getAll").get(authUser,getNotications)
router.route("/createNotification").post(authUser,createNotifications)



module.exports = router