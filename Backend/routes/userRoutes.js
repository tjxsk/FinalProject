const express = require('express');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');
const userModel = require('../model/userModel');

const userRoutes = new express.Router();
userRoutes.use(express.json());
userRoutes.use(express.urlencoded({ extended: true }));

//login
userRoutes.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ username: req.body.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (isPasswordValid) {
            const payload = {
                id: user._id,
                name: user.name,
                username: user.username,
            };
            const token = jwt.sign(payload, 'secretkey', { expiresIn: '3h' });

            res.status(200).json({ message: 'Login Successful', usertoken: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).json({ message: "Server error during login" });
    }
});

//signup
userRoutes.post('/signup', async (req, res) => {
    try {
        const { name, email, phoneNumber, username, password, interests } = req.body;

        const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); //hashing the password

        const newUser = new userModel({
            name,
            email,
            phoneNumber,
            username,
            password: hashedPassword,
            interests
        });

        await newUser.save();

        const payload = { uname: username };
        const token = jwt.sign(payload, 'secretkey');
        res.status(201).json({ message: "User registered successfully", usertoken: token });
    } catch (err) {
        console.error("Error registering user:", err.message); // More specific error logging
        res.status(500).json({ message: "Error registering user", error: err.message });
        console.log("Incoming signup data:", req.body);

    }
});





module.exports = userRoutes;