const mongoose = require('mongoose')

const SavedPostSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    SavedPostImg:{
        type:String
    },
    SavedPostauthor:{
        type:String
    },
    SavedPosttitle:{
        type:String
    },
    SavedPostbody:{
        type:String
    },
    
    SavedPostAuthorImg:{
        type:String
    },
    
    SavedPostComments:[
        {
        SavedPostId:{
            type:String
        },
        SavedPostcommentAuthor:{
            type:String
        },
        SavedPostcommentProfilePic:{
            type:String
        },
        SavedPostcommentBody:{
            type:String
        }

        }
    ],
    PostLikes:[
        {
            SavedauthorId:{
                type:String
            },
            SavedPostId:{
                type:String
            }
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model('SavedPost', SavedPostSchema);