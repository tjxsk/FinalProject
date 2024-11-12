const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); 


router.get('/user/interests', verifyToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.userId, 'interests');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ interests: user.interests });
    } catch (error) {
        console.error("Error retrieving interests:", error);
        res.status(500).json({ message: 'Error retrieving interests' });
    }
});

module.exports = router;
