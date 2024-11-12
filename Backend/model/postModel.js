const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postAuthor: {
        id: {
            type: String,
        },
        name: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    },
    postContent: {
        type: String,
        required: true,
        trim: true
    },
    postImage: {
        data: Buffer,
        contentType: String
    },
    postAudio: {
        data: Buffer,
        contentType: String
    },
    postTags: [
        {
            type: String,
            trim: true
        }
    ],
    postLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // who liked the post
        }
    ],
    postComments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // who commented
                required: true
            },
            text: {
                type: String,
                required: true,
                trim: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

const postModel = mongoose.model('post', postSchema);

module.exports = postModel;
