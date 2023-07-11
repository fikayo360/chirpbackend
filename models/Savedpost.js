const mongoose = require('mongoose')

const SavedPostSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    SavedPostImg:{
        type:String
    },
    SavedPostAuthor:{
        type:String
    },
    SavedPostTitle:{
        type:String
    },
    SavedPostBody:{
        type:String
    },
    
    SavedPostAuthorImg:{
        type:String
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('SavedPost', SavedPostSchema);