const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    ProfilePic:{
        type:String
    },
    username:{
        type:String
    },
    body:{
        type:String
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('Notifications',NotificationSchema)