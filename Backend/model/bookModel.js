const mongoose = require('mongoose');
// creating schema
const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        trim: true
    },
    bookAuthor: {
        type: String,
        required: true,
        trim: true,
    },
    bookImage: {
        data: Buffer,        // Image data as binary
        contentType: String  
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    bookOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: { 
            type: String, 
            enum: ['Point'], 
            required: false 
        },
        coordinates: { 
            type: [Number],
            required: false
        },
        name: { 
            type: String, 
            default: 'Unknown Location' 
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// bookSchema.index({ location: "2dsphere" });

// creating model
const bookModel = mongoose.model('book', bookSchema);



module.exports = bookModel;