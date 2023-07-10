const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    postImg:{
        type:String
    },
    postAuthor:{
        type:String
    },
    postTitle:{
        type:String
    },
    postBody:{
        type:String
    },
    url:{
        type:String
    },
    
    
    postComments:[
        {
        PostId:{
            type:String
        },
        PostcommentAuthor:{
            type:String
        },
        PostcommentProfilePic:{
            type:String
        },
         PostcommentBody:{
            type:String
        }

        }
    ],
    postLikes:[
        {
            authorName:{
                type:String
            },
            PostId:{
                type:String
            }
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model('Post', PostSchema);