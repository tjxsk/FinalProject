const express = require('express');
const multer = require('multer');
const router = new express.Router();
const postModel = require('../model/postModel');
const verifyToken = require('../middleware/verifyToken'); 


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/posts/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await postModel.findById(id);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});

router.get('/posts', verifyToken, async (req, res) => {
    try {
        const data = await postModel.find().sort({ createdAt: -1 });
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send('DATA NOT FOUND');
    }
});

router.post('/addPost', verifyToken, upload.fields([{ name: 'postImage' }, { name: 'postAudio' }]), async (req, res) => {
    try {
        const { postAuthor, postContent, postTags } = req.body;

        // Parse tags from comma-separated values if they are provided as a single string
        const tags = postTags ? postTags.split(',').map(tag => tag.trim()) : [];

        // Create a new post document
        const newPost = new postModel({
            postAuthor: {
                id: req.userId,
                name: req.name,
                username: req.username
            },
            postContent,
            postTags: tags,
        });

        // Add image to the post if provided
        if (req.files.postImage) {
            newPost.postImage = {
                data: req.files.postImage[0].buffer,
                contentType: req.files.postImage[0].mimetype
            };
        }

        // Add audio to the post if provided
        if (req.files.postAudio) {
            newPost.postAudio = {
                data: req.files.postAudio[0].buffer,
                contentType: req.files.postAudio[0].mimetype
            };
        }

        // Save the post to the database
        await newPost.save();
        res.status(201).json({ message: 'Post added successfully', post: newPost });
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).json({ message: 'Error adding post', error: error.message });
    }
});

router.delete('/deletePost/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const data = await postModel.findByIdAndDelete(id, req.body);
        res.status(200).send('Successfully deleted');
    } catch (error) {
        res.status(400).send('delete unsuccessfull');
    }
});


module.exports = router;