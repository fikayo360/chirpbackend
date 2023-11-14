const express = require("express")
const router = express.Router()
const {getNotications,createNotifications} = require('../controllers/Notificationscontroller')
const {authUser} = require('../middleware/auth')

/**
 * @swagger
 * /getAll:
 *   get:
 *     description: get all notifications
 */

router.route("/getAll").get(authUser,getNotications)
/**
 * @swagger
 * /createNotification:
 *   post:
 *     description: create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *               username:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: saved successfully
 */
router.route("/createNotification").post(authUser,createNotifications)



module.exports = router